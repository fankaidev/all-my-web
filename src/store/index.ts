import { create } from 'zustand';
import { Script } from '../types/script';
import { LLMSettings } from '../types/settings';

// Storage state
interface StorageState {
    scripts: Script[];
    llmSettings: LLMSettings;

    // Storage actions
    setScripts: (scripts: Script[]) => void;
    addScript: (script: Script) => void;
    updateScript: (id: number, updates: Partial<Script>) => void;
    deleteScript: (id: number) => void;
    setLLMSettings: (settings: LLMSettings) => void;
}

// UI state
interface UIState {
    isInitialized: boolean;
    lastError: string | null;
    clearError: () => void;
}

// Create store with persistence
const useStore = create<StorageState & UIState>((set, get) => ({
    // Storage state
    scripts: [],
    llmSettings: {
        apiKey: '',
        apiBase: 'https://api.openai.com/v1',
    },

    // UI state
    isInitialized: false,
    lastError: null,

    // Storage actions
    setScripts: async (scripts) => {
        try {
            await chrome.storage.local.set({ scripts });
            set({ scripts });
        } catch (error) {
            set({ lastError: 'Failed to save scripts' });
            console.error('Failed to save scripts:', error);
        }
    },

    addScript: async (script) => {
        try {
            const scripts = [...get().scripts, script];
            await chrome.storage.local.set({ scripts });
            set({ scripts });
        } catch (error) {
            set({ lastError: 'Failed to add script' });
            console.error('Failed to add script:', error);
        }
    },

    updateScript: async (id, updates) => {
        try {
            const scripts = get().scripts.map((script) =>
                script.id === id ? { ...script, ...updates } : script
            );
            await chrome.storage.local.set({ scripts });
            set({ scripts });
        } catch (error) {
            set({ lastError: 'Failed to update script' });
            console.error('Failed to update script:', error);
        }
    },

    deleteScript: async (id) => {
        try {
            const scripts = get().scripts.filter((script) => script.id !== id);
            await chrome.storage.local.set({ scripts });
            set({ scripts });
        } catch (error) {
            set({ lastError: 'Failed to delete script' });
            console.error('Failed to delete script:', error);
        }
    },

    setLLMSettings: async (settings) => {
        try {
            await chrome.storage.sync.set({ llm_settings: settings });
            set({ llmSettings: settings });
        } catch (error) {
            set({ lastError: 'Failed to save LLM settings' });
            console.error('Failed to save LLM settings:', error);
        }
    },

    // UI actions
    clearError: () => set({ lastError: null }),
}));

// Initialize store from chrome.storage
export const initializeStore = async () => {
    try {
        // Load scripts
        const { scripts = [] } = await chrome.storage.local.get('scripts');
        useStore.setState({ scripts });

        // Load LLM settings
        const { llm_settings } = await chrome.storage.sync.get('llm_settings');
        if (llm_settings) {
            useStore.setState({ llmSettings: llm_settings });
        }

        // Mark as initialized
        useStore.setState({ isInitialized: true });
    } catch (error) {
        console.error('Failed to initialize store:', error);
        useStore.setState({
            lastError: 'Failed to load data from storage',
            isInitialized: true // Still mark as initialized to prevent infinite loading
        });
    }
};

export default useStore;