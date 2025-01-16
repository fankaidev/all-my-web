import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { createChromeMock, resetChromeMocks } from './chrome';

// Run cleanup after each test case
afterEach(() => {
    cleanup();
});

// Setup Chrome API mock
const chromeMock = createChromeMock();
vi.stubGlobal('chrome', chromeMock);

// Reset mocks before each test
beforeEach(async () => {
    resetChromeMocks(chromeMock);

    // Create a mock active tab
    const tab = await chromeMock.tabs.create({
        url: 'https://example.com',
        active: true,
        windowId: 1,
    });

    // Trigger tab activated event
    chromeMock.tabs.onActivated.trigger({ tabId: tab.id!, windowId: 1 });

    // Trigger tab updated event to ensure URL is set
    chromeMock.tabs.onUpdated.trigger(tab.id!, { status: 'complete' }, tab);

    // Wait a tick to ensure React effects are triggered
    await new Promise(resolve => setTimeout(resolve, 0));
});