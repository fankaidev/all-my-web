import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerScripts } from '../../../src/pages/background/index';

// Mock chrome API
vi.mock('chrome', () => ({
    userScripts: {
        configureWorld: vi.fn(),
        register: vi.fn(),
        unregister: vi.fn(),
        getScripts: vi.fn().mockReturnValue(Promise.resolve([]))
    },
    storage: {
        local: {
            get: vi.fn().mockReturnValue(Promise.resolve({}))
        }
    },
    tabs: {
        query: vi.fn().mockReturnValue(Promise.resolve([]))
    },
    action: {
        setBadgeText: vi.fn(),
        setBadgeBackgroundColor: vi.fn()
    }
}));

describe('Script Counting', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock developer mode enabled
        (chrome.userScripts as any) = {};

        // Mock storage
        (chrome.storage.local.get as any).mockReturnValue(Promise.resolve({
            scripts: [
                { id: 1, body: '// @match https://example.com/*', isPaused: false },
                { id: 2, body: '// @match https://test.com/*', isPaused: false },
                { id: 3, body: '// @match https://example.com/*', isPaused: true }
            ]
        }));

        // Mock tabs
        (chrome.tabs.query as any).mockReturnValue(Promise.resolve([
            { id: 1, url: 'https://example.com/page1' },
            { id: 2, url: 'https://test.com/page1' },
            { id: 3, url: 'https://other.com/page1' }
        ]));

        // Mock getScripts
        (chrome.userScripts.getScripts as any).mockReturnValue(Promise.resolve([
            { id: 'amw-script-1', matches: ['https://example.com/*'] },
            { id: 'amw-script-2', matches: ['https://test.com/*'] }
        ]));
    });

    it('should update badge for matching scripts', async () => {
        await registerScripts();

        // Should set badge text for each tab
        expect(chrome.action.setBadgeText).toHaveBeenCalledWith({
            text: '1',
            tabId: 1
        });
        expect(chrome.action.setBadgeText).toHaveBeenCalledWith({
            text: '1',
            tabId: 2
        });
        expect(chrome.action.setBadgeText).toHaveBeenCalledWith({
            text: '',
            tabId: 3
        });

        // Should set badge color for each tab
        expect(chrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
            color: '#4CAF50',
            tabId: 1
        });
    });

    it('should not count paused scripts', async () => {
        await registerScripts();

        // Only non-paused scripts should be registered
        expect(chrome.userScripts.register).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ id: 'amw-script-1' }),
                expect.objectContaining({ id: 'amw-script-2' })
            ])
        );
        expect(chrome.userScripts.register).toHaveBeenCalledTimes(1);
    });
});