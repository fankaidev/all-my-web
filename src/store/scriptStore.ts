import { create } from 'zustand';
import { Script } from '../types/script';

interface ScriptState {
    // State
    scripts: Script[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setScripts: (scripts: Script[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Script operations
    loadScripts: () => Promise<void>;
    addScript: () => Promise<Script>;
    editScript: (id: number, name: string, requirement: string, body: string) => Promise<void>;
    deleteScript: (id: number) => Promise<void>;
    togglePause: (id: number) => Promise<void>;
}

const useScriptStore = create<ScriptState>((set, get) => ({
    // Initial state
    scripts: [],
    isLoading: true,
    error: null,

    // State setters
    setScripts: (scripts) => set({ scripts }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Script operations
    loadScripts: async () => {
        try {
            set({ isLoading: true, error: null });
            const result = await chrome.storage.local.get('scripts');
            const storedScripts = result.scripts || [];
            // Ensure all scripts have isPaused field
            const updatedScripts = storedScripts.map((script: Script) => ({
                ...script,
                isPaused: script.isPaused || false
            }));
            set({ scripts: updatedScripts });
            console.debug('[amw] Set scripts state:', updatedScripts);
        } catch (err) {
            console.error('Error loading scripts:', err);
            set({ error: 'Failed to load scripts' });
        } finally {
            set({ isLoading: false });
        }
    },

    addScript: async () => {
        try {
            set({ error: null });
            const { scripts } = get();
            const newScript: Script = {
                id: scripts.length ? scripts[scripts.length - 1].id + 1 : 1,
                name: 'New Script',
                requirement: '',
                body: 'console.log("hello")',
                isPaused: false,
            };
            const updatedScripts = [...scripts, newScript];
            await chrome.storage.local.set({ scripts: updatedScripts });
            set({ scripts: updatedScripts });
            return newScript;
        } catch (err) {
            console.error('Error adding script:', err);
            set({ error: 'Failed to add script' });
            throw err;
        }
    },

    editScript: async (id, name, requirement, body) => {
        try {
            set({ error: null });
            const { scripts } = get();
            const updatedScripts = scripts.map(script =>
                script.id === id
                    ? { ...script, name, requirement, body }
                    : script
            );
            await chrome.storage.local.set({ scripts: updatedScripts });
            set({ scripts: updatedScripts });
        } catch (err) {
            console.error('Error editing script:', err);
            set({ error: 'Failed to edit script' });
            throw err;
        }
    },

    deleteScript: async (id) => {
        try {
            set({ error: null });
            const { scripts } = get();
            const updatedScripts = scripts.filter(script => script.id !== id);
            await chrome.storage.local.set({ scripts: updatedScripts });
            set({ scripts: updatedScripts });
        } catch (err) {
            console.error('Error deleting script:', err);
            set({ error: 'Failed to delete script' });
            throw err;
        }
    },

    togglePause: async (id) => {
        try {
            set({ error: null });
            const { scripts } = get();
            const updatedScripts = scripts.map(script =>
                script.id === id
                    ? { ...script, isPaused: !script.isPaused }
                    : script
            );
            await chrome.storage.local.set({ scripts: updatedScripts });
            set({ scripts: updatedScripts });
        } catch (err) {
            console.error('Error toggling script pause state:', err);
            set({ error: 'Failed to toggle script pause state' });
            throw err;
        }
    },
}));

export default useScriptStore;