console.log('[amw] service worker loaded');

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

interface Script {
    id: number;
    name: string;
    body: string;
}

// Register all active scripts
async function registerScripts() {
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

        // Register all active scripts
        await chrome.userScripts.register(scripts.map(script => ({
            id: `amw-script-${script.id}`,
            matches: ['<all_urls>'],
            js: [{ code: script.body }],
            world: 'USER_SCRIPT',
            runAt: 'document_idle'
        })));

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

// Log registered scripts when page loads
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.debug('[amw] tab updated:', tabId, changeInfo.status, tab.url, tab);
    try {
        const scripts = await chrome.userScripts.getScripts();
        console.debug('[amw] active scripts for tab:', scripts);
    } catch (error) {
        console.error('[amw] failed to get registered scripts:', error);
    }
});

