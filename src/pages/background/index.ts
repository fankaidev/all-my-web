import { Script } from '../../types/script';
import { extractMatchPatterns, extractRunAt } from '../../utils/scriptParser';

console.log('[amw] service worker loaded');

// Track active scripts per tab
const tabScriptCounts = new Map<number, number>();

// Update badge for a specific tab
async function updateBadge(tabId: number) {
    const count = tabScriptCounts.get(tabId) || 0;
    await chrome.action.setBadgeText({
        text: count > 0 ? count.toString() : '',
        tabId
    });
    await chrome.action.setBadgeBackgroundColor({
        color: '#4CAF50',
        tabId
    });
}

// Helper function to check if developer mode is enabled
async function isDeveloperModeEnabled(): Promise<boolean> {
    try {
        // Property access which throws if developer mode is not enabled
        chrome.userScripts;
        return true;
    } catch {
        return false;
    }
}

// Configure user script world
async function configureUserScriptWorld() {
    try {
        if (!await isDeveloperModeEnabled()) {
            console.error('[amw] developer mode must be enabled in chrome://extensions');
            return;
        }

        await chrome.userScripts.configureWorld({
            csp: "script-src 'self' 'unsafe-eval'",  // Allow eval in user scripts
            messaging: true  // Enable messaging between user scripts and extension
        });
        console.debug('[amw] user script world configured successfully');
    } catch (error) {
        console.error('[amw] failed to configure user script world:', error);
    }
}

// Register all active scripts
export async function registerScripts() {
    try {
        if (!await isDeveloperModeEnabled()) {
            throw new Error('Developer mode must be enabled in chrome://extensions');
        }

        // Get all scripts from storage
        const { scripts } = await chrome.storage.local.get('scripts');
        if (!scripts || !Array.isArray(scripts)) return;

        // Unregister all existing AMW scripts
        const existingScripts = await chrome.userScripts.getScripts();
        console.debug('[amw] unregistering existing scripts:', existingScripts);
        await chrome.userScripts.unregister()

        // Register all active (non-paused) scripts
        const activeScripts = scripts.filter((script: Script) => !script.isPaused);
        await chrome.userScripts.register(activeScripts.map(script => ({
            id: `amw-script-${script.id}`,
            matches: extractMatchPatterns(script.body),
            js: [{ code: script.body }],
            world: 'USER_SCRIPT',
            runAt: extractRunAt(script.body)
        })));

        // Update script counts for all tabs
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
            if (tab.id) {
                const matchingScripts = activeScripts.filter(script => {
                    const patterns = extractMatchPatterns(script.body);
                    return patterns.some(pattern =>
                        tab.url && tab.url.match(pattern.replace(/\*/g, '.*')));
                });
                tabScriptCounts.set(tab.id, matchingScripts.length);
                await updateBadge(tab.id);
            }
        }

        console.log('[amw] scripts registered successfully');
        const registeredScripts = await chrome.userScripts.getScripts();
        console.debug('[amw] registered scripts:', registeredScripts);
    } catch (error) {
        console.error('[amw] failed to register scripts:', error);
        throw error;
    }
}

// Initialize side panel and register user script on extension load/update
chrome.runtime.onInstalled.addListener(async (details) => {
    console.debug('[amw] initializing extension');
    try {
        // Initialize side panel
        await chrome.sidePanel.setOptions({
            enabled: true,
            path: 'src/pages/panel/index.html'
        });
        console.log('[amw] side panel initialized successfully');

        // Configure user script world
        await configureUserScriptWorld();

        // Register all scripts from storage
        await registerScripts();
    } catch (error) {
        console.error('[amw] failed to initialize extension:', error);
    }
});

// Open side panel on extension icon click
chrome.action.onClicked.addListener((tab) => {
    console.debug('[amw] attempting to open side panel for window:', tab.windowId);
    try {
        chrome.sidePanel.open({ windowId: tab.windowId });
        console.debug('[amw] side panel opened successfully');
    } catch (error) {
        console.error('[amw] failed to open side panel:', error);
    }
});

// Listen for storage changes to update scripts
chrome.storage.onChanged.addListener(async (changes) => {
    if (changes.scripts) {
        console.debug('[amw] scripts changed, updating registration');
        await registerScripts();
    }
});

// Log registered scripts when page loads and update badge
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.debug('[amw] tab updated:', tabId, changeInfo.status, tab.url, tab);
    try {
        if (changeInfo.status === 'complete' && tab.url) {
            const scripts = await chrome.userScripts.getScripts();
            console.debug('[amw] active scripts for tab:', scripts);

            // Update script count for this tab
            const matchingScripts = scripts.filter(script => {
                return script.matches?.some(pattern =>
                    tab.url && tab.url.match(pattern.replace(/\*/g, '.*'))) ?? false;
            });
            tabScriptCounts.set(tabId, matchingScripts.length);
            await updateBadge(tabId);
        }
    } catch (error) {
        console.error('[amw] failed to get registered scripts:', error);
    }
});

// Clear script count when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    tabScriptCounts.delete(tabId);
});

// Handle context collection requests from panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PAGE_CONTEXT') {
        // Get active tab
        chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
            if (!tab?.id) {
                sendResponse({ success: false, error: 'No active tab found' });
                return;
            }

            try {
                // Get context by injecting script
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        // Get selected HTML if any
                        const selection = window.getSelection();
                        let selectionHtml = null;
                        if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            const container = document.createElement('div');
                            container.appendChild(range.cloneContents());
                            selectionHtml = container.innerHTML;
                        }

                        return {
                            url: window.location.href,
                            title: document.title,
                            selectionHtml
                        };
                    }
                });

                // Send back the first result
                const context = results[0]?.result;
                if (!context) {
                    throw new Error('Failed to collect page context');
                }

                sendResponse({ success: true, data: context });
            } catch (error) {
                console.error('[amw] failed to collect page context:', error);
                sendResponse({ success: false, error: String(error) });
            }
        });
        return true; // Keep the message channel open for async response
    }
});

