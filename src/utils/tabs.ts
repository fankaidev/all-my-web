/**
 * Get the current active tab in the current window
 * @returns Promise that resolves to the current tab, or null if no active tab found
 */
export async function getCurrentTab() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab || null;
    } catch (error) {
        console.error('[amw] failed to get current tab:', error);
        return null;
    }
}