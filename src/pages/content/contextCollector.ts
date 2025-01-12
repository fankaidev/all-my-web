import { collectPageContext } from '../../utils/pageContext';

// Listen for context collection requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'COLLECT_PAGE_CONTEXT') {
        try {
            const context = collectPageContext();
            sendResponse({ success: true, data: context });
        } catch (error) {
            console.error('Failed to collect page context:', error);
            sendResponse({ success: false, error: String(error) });
        }
        return true; // Keep the message channel open for async response
    }
});