import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Script } from '../../../src/types/script';
import { extractRunAt } from '../../../src/utils/scriptParser';
import { createChromeMock, resetChromeMocks } from '../../setup/chrome';

// Mock Chrome API
const mockChrome = createChromeMock();
vi.stubGlobal('chrome', mockChrome);

// Mock scripts with different @run-at values
const testScripts: Script[] = [
    {
        id: 1,
        name: 'Start Script',
        requirement: 'Test script with document_start',
        body: `
            // ==UserScript==
            // @name Start Script
            // @match *://*/*
            // @run-at document_start
            // ==UserScript==
            console.log('document_start script');
        `,
        isPaused: false
    },
    {
        id: 2,
        name: 'End Script',
        requirement: 'Test script with document_end',
        body: `
            // ==UserScript==
            // @name End Script
            // @match *://*/*
            // @run-at document_end
            // ==UserScript==
            console.log('document_end script');
        `,
        isPaused: false
    },
    {
        id: 3,
        name: 'Idle Script',
        requirement: 'Test script with document_idle',
        body: `
            // ==UserScript==
            // @name Idle Script
            // @match *://*/*
            // @run-at document_idle
            // ==UserScript==
            console.log('document_idle script');
        `,
        isPaused: false
    }
];

describe('Script Registration', () => {
    beforeEach(() => {
        // Reset all Chrome API mocks
        resetChromeMocks(mockChrome);

        // Setup storage with test scripts
        mockChrome.storage.local.get.mockResolvedValue({ scripts: testScripts });

        // Mock userScripts API
        const registeredScripts = new Map();
        mockChrome.userScripts.register.mockImplementation(async (scripts) => {
            scripts.forEach(script => {
                const id = script.id || Math.random().toString(36).slice(2);
                registeredScripts.set(id, { ...script, id });
            });
        });
        mockChrome.userScripts.getScripts.mockImplementation(async () =>
            Array.from(registeredScripts.values())
        );
        mockChrome.userScripts.configureWorld.mockResolvedValue(undefined);

        // Mock tabs API
        mockChrome.tabs.onUpdated = {
            addListener: vi.fn(),
            removeListener: vi.fn(),
            hasListener: vi.fn(),
            hasListeners: vi.fn(),
            trigger: vi.fn()
        };
        mockChrome.tabs.onActivated = {
            addListener: vi.fn(),
            removeListener: vi.fn(),
            hasListener: vi.fn(),
            hasListeners: vi.fn(),
            trigger: vi.fn()
        };
        mockChrome.tabs.onRemoved = {
            addListener: vi.fn(),
            removeListener: vi.fn(),
            hasListener: vi.fn(),
            hasListeners: vi.fn(),
            trigger: vi.fn()
        };
    });

    it('should register scripts with correct @run-at values', async () => {
        // Import registerScripts dynamically to ensure fresh mocks
        const { registerScripts } = await import('../../../src/pages/background');

        // Register test scripts
        await registerScripts();

        // Get registered scripts
        const registeredScripts = await mockChrome.userScripts.getScripts();

        // Verify each script is registered with correct timing
        testScripts.forEach((script, index) => {
            const registered = registeredScripts[index];
            expect(registered).toBeDefined();
            expect(registered.runAt).toBe(extractRunAt(script.body));
        });
    });

    it('should register scripts in correct order', async () => {
        const { registerScripts } = await import('../../../src/pages/background');

        // Register test scripts
        await registerScripts();

        // Get registered scripts
        const registeredScripts = await mockChrome.userScripts.getScripts();

        // Verify registration order matches timing priority
        const timings = registeredScripts.map(script => script.runAt);
        expect(timings).toEqual([
            'document_start',
            'document_end',
            'document_idle'
        ]);
    });

    it('should handle paused scripts correctly', async () => {
        // Modify one script to be paused
        const pausedScripts = testScripts.map(script =>
            script.id === 2 ? { ...script, isPaused: true } : script
        );
        vi.spyOn(mockChrome.storage.local, 'get').mockImplementation(() => Promise.resolve({ scripts: pausedScripts }));

        const { registerScripts } = await import('../../../src/pages/background');

        // Register scripts
        await registerScripts();

        // Get registered scripts
        const registeredScripts = await mockChrome.userScripts.getScripts();

        // Verify only non-paused scripts are registered
        expect(registeredScripts).toHaveLength(2);
        expect(registeredScripts.map(s => s.runAt)).toEqual([
            'document_start',
            'document_idle'
        ]);
    });

    it('should handle invalid @run-at values', async () => {
        // Add a script with invalid @run-at
        const scriptsWithInvalid = [
            ...testScripts,
            {
                id: 4,
                name: 'Invalid Script',
                requirement: 'Test script with invalid @run-at',
                body: `
                    // ==UserScript==
                    // @name Invalid Script
                    // @match *://*/*
                    // @run-at invalid_value
                    // ==UserScript==
                    console.log('invalid timing script');
                `,
                isPaused: false
            }
        ];
        vi.spyOn(mockChrome.storage.local, 'get').mockImplementation(() => Promise.resolve({ scripts: scriptsWithInvalid }));

        const { registerScripts } = await import('../../../src/pages/background');

        // Register scripts
        await registerScripts();

        // Get registered scripts
        const registeredScripts = await mockChrome.userScripts.getScripts();

        // Verify invalid @run-at defaults to document_idle
        const lastScript = registeredScripts[registeredScripts.length - 1];
        expect(lastScript.runAt).toBe('document_idle');
    });
});