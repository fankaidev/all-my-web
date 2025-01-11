console.log('[amw] service worker loaded');

// Configure user script world
chrome.userScripts.configureWorld({
    csp: "script-src 'self' 'unsafe-eval'",  // Allow eval in user scripts
    messaging: true  // Enable messaging between user scripts and extension
}).catch(error => {
    console.error('[amw] failed to configure user script world:', error);
});

// Helper function to register user script
async function registerUserScript(script: string) {
    try {
        await chrome.userScripts.register([{
            id: 'amw-user-script',
            matches: ['<all_urls>'],
            js: [{ code: script }],
            world: 'USER_SCRIPT'
        }]);
        console.log('[amw] user script registered successfully');
    } catch (error) {
        console.error('[amw] failed to register user script:', error);
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

        // Re-register user script if exists
        const { userScript } = await chrome.storage.sync.get(['userScript']);
        if (userScript) {
            await registerUserScript(userScript);
        }
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

// Listen for storage changes to update user script
chrome.storage.onChanged.addListener(async (changes) => {
    if (changes.userScript) {
        console.debug('[amw] user script changed, re-registering');
        try {
            // Unregister existing script first
            await chrome.userScripts.unregister();
            // Register new script if exists
            if (changes.userScript.newValue) {
                await registerUserScript(changes.userScript.newValue);
            }
        } catch (error) {
            console.error('[amw] failed to update user script:', error);
        }
    }
});
