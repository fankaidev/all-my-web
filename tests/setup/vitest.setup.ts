import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Run cleanup after each test case
afterEach(() => {
    cleanup();
});

// Mock Chrome extension API
vi.stubGlobal('chrome', {
    runtime: {
        getManifest: vi.fn(() => ({ manifest_version: 3 })),
        onMessage: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
        sendMessage: vi.fn(),
    },
    storage: {
        local: {
            get: vi.fn(),
            set: vi.fn(),
        },
        onChanged: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
    },
    tabs: {
        query: vi.fn(),
        sendMessage: vi.fn(),
    },
    userScripts: {
        register: vi.fn(),
        unregister: vi.fn(),
        getScripts: vi.fn(),
    },
});