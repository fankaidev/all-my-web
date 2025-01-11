console.log('[amw]: background script loaded');

// Initialize side panel on extension load
chrome.runtime.onInstalled.addListener(async () => {
    console.debug('[amw]: initializing side panel...');
    try {
        await chrome.sidePanel.setOptions({
            enabled: true,
            path: 'src/pages/panel/index.html'
        });
        console.log('[amw]: side panel initialized successfully');
    } catch (error) {
        console.error('[amw]: failed to initialize side panel:', error);
    }
});

// Open side panel on extension icon click
chrome.action.onClicked.addListener((tab) => {
    console.debug('[amw]: attempting to open side panel for window:', tab.windowId);
    try {
        // Open side panel directly in response to user click
        chrome.sidePanel.open({ windowId: tab.windowId });
        console.debug('[amw]: side panel opened successfully');
    } catch (error) {
        console.error('[amw]: failed to open side panel:', error);
    }
});
