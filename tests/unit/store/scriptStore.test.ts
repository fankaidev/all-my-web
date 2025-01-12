import { beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';

interface Script {
    id: number;
    name: string;
    body: string;
    isPaused: boolean;
    requirement: string;
}

interface ScriptStore {
    scripts: Script[];
    addScript: (script: Omit<Script, 'id' | 'isPaused'>) => Promise<void>;
    updateScript: (script: Script) => Promise<void>;
    deleteScript: (id: number) => Promise<void>;
    toggleScript: (id: number) => Promise<void>;
    loadScripts: () => Promise<void>;
}

interface StorageData {
    scripts: Script[];
}

declare global {
    namespace chrome.storage {
        interface StorageArea {
            get(keys: string | string[] | null): Promise<StorageData>;
            set(items: StorageData): Promise<void>;
        }
    }
}

const mockScript: Script = {
    id: 1,
    name: 'Test Script',
    body: '// @match https://example.com/*\nconsole.log("test")',
    isPaused: false,
    requirement: 'Test requirement',
};

const mockScripts = [mockScript];

// Mock Chrome storage API
vi.mock('chrome', () => ({
    storage: {
        local: {
            get: vi.fn(),
            set: vi.fn().mockImplementation(() => Promise.resolve()),
        },
    },
}));

const createStore = () => {
    return create<ScriptStore>()((set, get) => ({
        scripts: [],
        addScript: async (script) => {
            const newScript = {
                ...script,
                id: get().scripts.length + 1,
                isPaused: false,
            };
            set({ scripts: [...get().scripts, newScript] });
            await chrome.storage.local.set({ scripts: get().scripts });
        },
        updateScript: async (script) => {
            const scripts = get().scripts.map(s =>
                s.id === script.id ? script : s
            );
            set({ scripts });
            await chrome.storage.local.set({ scripts });
        },
        deleteScript: async (id) => {
            const scripts = get().scripts.filter(s => s.id !== id);
            set({ scripts });
            await chrome.storage.local.set({ scripts });
        },
        toggleScript: async (id) => {
            const scripts = get().scripts.map(s =>
                s.id === id ? { ...s, isPaused: !s.isPaused } : s
            );
            set({ scripts });
            await chrome.storage.local.set({ scripts });
        },
        loadScripts: async () => {
            const result = await chrome.storage.local.get('scripts');
            set({ scripts: result.scripts || [] });
        },
    }));
};

describe('scriptStore', () => {
    let store: ReturnType<typeof createStore>;

    beforeEach(() => {
        vi.clearAllMocks();
        store = createStore();
        vi.mocked(chrome.storage.local.get).mockResolvedValue({ scripts: [] });
    });

    describe('addScript', () => {
        it('should add a script with auto-incremented ID', async () => {
            await store.getState().addScript({
                name: mockScript.name,
                requirement: mockScript.requirement,
                body: mockScript.body,
            });
            expect(store.getState().scripts).toHaveLength(1);
            expect(store.getState().scripts[0].id).toBe(1);
        });
    });

    describe('updateScript', () => {
        it('should update existing script', async () => {
            await store.getState().addScript({
                name: mockScript.name,
                requirement: mockScript.requirement,
                body: mockScript.body,
            });

            const updatedScript: Script = {
                id: 1,
                name: 'Updated Name',
                requirement: 'Test requirement',
                body: 'console.log("updated")',
                isPaused: false,
            };

            await store.getState().updateScript(updatedScript);
            expect(store.getState().scripts[0]).toEqual(updatedScript);
        });

        it('should not update non-existing script', async () => {
            await store.getState().addScript({
                name: mockScript.name,
                requirement: mockScript.requirement,
                body: mockScript.body,
            });

            const nonExistingScript: Script = {
                id: 999,
                name: 'Non-existing',
                requirement: 'Test requirement',
                body: 'console.log("non-existing")',
                isPaused: false,
            };

            await store.getState().updateScript(nonExistingScript);
            expect(store.getState().scripts).toHaveLength(1);
            expect(store.getState().scripts[0].id).toBe(1);
        });
    });

    describe('deleteScript', () => {
        it('should delete script by id', async () => {
            await store.getState().addScript({
                name: mockScript.name,
                requirement: mockScript.requirement,
                body: mockScript.body,
            });
            expect(store.getState().scripts).toHaveLength(1);

            await store.getState().deleteScript(1);
            expect(store.getState().scripts).toHaveLength(0);
        });
    });

    describe('toggleScript', () => {
        it('should toggle script pause state', async () => {
            await store.getState().addScript({
                name: mockScript.name,
                requirement: mockScript.requirement,
                body: mockScript.body,
            });
            expect(store.getState().scripts[0].isPaused).toBe(false);

            await store.getState().toggleScript(1);
            expect(store.getState().scripts[0].isPaused).toBe(true);

            await store.getState().toggleScript(1);
            expect(store.getState().scripts[0].isPaused).toBe(false);
        });
    });

    describe('storage sync', () => {
        it('should load scripts from storage on init', async () => {
            vi.mocked(chrome.storage.local.get).mockResolvedValueOnce({ scripts: mockScripts });
            await store.getState().loadScripts();
            expect(store.getState().scripts).toEqual(mockScripts);
        });

        it('should save scripts to storage when modified', async () => {
            await store.getState().addScript({
                name: mockScript.name,
                requirement: mockScript.requirement,
                body: mockScript.body,
            });

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                scripts: store.getState().scripts,
            });
        });
    });
});