import { vi } from 'vitest';

/**
 * Create a mock event handler with addListener and removeListener
 */
function createEventHandler() {
    const listeners = new Set<Function>();
    return {
        addListener: vi.fn((callback: Function) => listeners.add(callback)),
        removeListener: vi.fn((callback: Function) => listeners.delete(callback)),
        hasListener: vi.fn((callback: Function) => listeners.has(callback)),
        hasListeners: vi.fn(() => listeners.size > 0),
        // Helper to trigger the event
        trigger: (...args: any[]) => {
            listeners.forEach(callback => callback(...args));
        },
    };
}

/**
 * Create storage mock with get/set and change events
 */
function createStorageMock() {
    const storage = new Map<string, any>();
    const onChanged = createEventHandler();

    return {
        local: {
            get: vi.fn(async (keys?: string | string[] | null) => {
                if (!keys) {
                    return Object.fromEntries(storage.entries());
                }
                if (typeof keys === 'string') {
                    return { [keys]: storage.get(keys) };
                }
                return Object.fromEntries(
                    keys.map(key => [key, storage.get(key)])
                );
            }),
            set: vi.fn(async (items: Record<string, any>) => {
                const changes: Record<string, chrome.storage.StorageChange> = {};
                Object.entries(items).forEach(([key, newValue]) => {
                    const oldValue = storage.get(key);
                    storage.set(key, newValue);
                    changes[key] = { oldValue, newValue };
                });
                onChanged.trigger(changes, 'local');
            }),
            remove: vi.fn(async (keys: string | string[]) => {
                const keysToRemove = Array.isArray(keys) ? keys : [keys];
                const changes: Record<string, chrome.storage.StorageChange> = {};
                keysToRemove.forEach(key => {
                    const oldValue = storage.get(key);
                    storage.delete(key);
                    changes[key] = { oldValue, newValue: undefined };
                });
                onChanged.trigger(changes, 'local');
            }),
            clear: vi.fn(async () => {
                const changes: Record<string, chrome.storage.StorageChange> = {};
                storage.forEach((value, key) => {
                    changes[key] = { oldValue: value, newValue: undefined };
                });
                storage.clear();
                onChanged.trigger(changes, 'local');
            }),
        },
        onChanged,
        // Helper to get internal storage state
        _storage: storage,
    };
}

interface RegisteredScript extends chrome.userScripts.RegisteredUserScript {
    matches: string[];
    js: { code: string }[];
    runAt: 'document_start' | 'document_end' | 'document_idle';
}

interface UserScriptsMock {
    register: ReturnType<typeof vi.fn>;
    unregister: ReturnType<typeof vi.fn>;
    getScripts: ReturnType<typeof vi.fn>;
    configureWorld: ReturnType<typeof vi.fn>;
    _scripts: Map<string, RegisteredScript>;
}

/**
 * Create userScripts mock with registration tracking
 */
function createUserScriptsMock(): UserScriptsMock {
    const registeredScripts = new Map<string, RegisteredScript>();
    return {
        register: vi.fn(async (scripts: Array<{
            id?: string;
            matches: string[];
            js: { code: string }[];
            runAt: 'document_start' | 'document_end' | 'document_idle';
        }>) => {
            scripts.forEach(script => {
                const id = script.id || Math.random().toString(36).slice(2);
                registeredScripts.set(id, { ...script, id });
            });
        }),
        unregister: vi.fn(async (scriptIds?: string[]) => {
            if (!scriptIds) {
                registeredScripts.clear();
            } else {
                scriptIds.forEach(id => registeredScripts.delete(id));
            }
        }),
        getScripts: vi.fn(async () => Array.from(registeredScripts.values())),
        configureWorld: vi.fn(),
        // Helper to get internal scripts state
        _scripts: registeredScripts,
    };
}

/**
 * Create runtime mock with message passing
 */
function createRuntimeMock() {
    const onMessage = createEventHandler();
    const onInstalled = createEventHandler();
    return {
        getManifest: vi.fn(() => ({ manifest_version: 3 })),
        onMessage,
        onInstalled,
        sendMessage: vi.fn(async (message: any) => {
            // Simulate message passing
            onMessage.trigger(message, { id: 'sender' });
        }),
    };
}

/**
 * Create tabs mock with basic functionality
 */
function createTabsMock() {
    const tabs = new Map<number, chrome.tabs.Tab>();
    let lastTabId = 0;
    const onUpdated = createEventHandler();
    const onActivated = createEventHandler();

    return {
        query: vi.fn(async (queryInfo: chrome.tabs.QueryInfo) => {
            return Array.from(tabs.values()).filter(tab => {
                if (queryInfo.active !== undefined) return tab.active === queryInfo.active;
                if (queryInfo.url !== undefined) return tab.url === queryInfo.url;
                if (queryInfo.currentWindow !== undefined) return tab.windowId === 1; // Mock current window
                return true;
            });
        }),
        get: vi.fn(async (tabId: number) => {
            const tab = tabs.get(tabId);
            if (!tab) throw new Error('Tab not found');
            return tab;
        }),
        sendMessage: vi.fn(async (tabId: number, message: any) => {
            if (!tabs.has(tabId)) throw new Error('Tab not found');
            // Message handling can be implemented if needed
        }),
        create: vi.fn(async (createProperties: chrome.tabs.CreateProperties) => {
            const tabId = ++lastTabId;
            const tab: chrome.tabs.Tab = {
                id: tabId,
                index: tabs.size,
                highlighted: false,
                active: createProperties.active ?? false,
                selected: createProperties.active ?? false,
                incognito: false,
                pinned: createProperties.pinned ?? false,
                url: createProperties.url,
                discarded: false,
                autoDiscardable: true,
                groupId: -1,
                windowId: createProperties.windowId ?? 1,
            };
            tabs.set(tabId, tab);
            return tab;
        }),
        onUpdated,
        onActivated,
        // Helper to get internal tabs state
        _tabs: tabs,
    };
}

/**
 * Create complete Chrome API mock
 */
export function createChromeMock() {
    return {
        storage: createStorageMock(),
        runtime: createRuntimeMock(),
        tabs: createTabsMock(),
        userScripts: createUserScriptsMock(),
        sidePanel: {
            setOptions: vi.fn(),
            open: vi.fn(),
        },
        action: {
            onClicked: createEventHandler(),
        },
    };
}

/**
 * Reset all Chrome API mocks
 */
export function resetChromeMocks(chrome: ReturnType<typeof createChromeMock>) {
    vi.clearAllMocks();
    chrome.storage._storage.clear();
    chrome.userScripts._scripts.clear();
    chrome.tabs._tabs.clear();
}