import { create } from 'zustand';
import { LLMSettings } from '../types/llm';
import { loadLLMSettings, saveLLMSettings } from '../utils/storage';

interface LLMSettingsState {
    settings: LLMSettings;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
    isLoading: boolean;
    setSettings: (settings: Partial<LLMSettings>) => void;
    saveSettings: () => Promise<void>;
    loadSettings: () => Promise<void>;
}

export const useLLMSettings = create<LLMSettingsState>((set, get) => ({
    settings: {
        apiKey: '',
        apiBase: '',
    },
    saveStatus: 'idle',
    isLoading: false,

    setSettings: (newSettings) => {
        set((state) => ({
            settings: {
                ...state.settings,
                ...newSettings,
            },
        }));
    },

    saveSettings: async () => {
        set({ saveStatus: 'saving' });
        try {
            await saveLLMSettings(get().settings);
            set({ saveStatus: 'saved' });
            setTimeout(() => {
                set({ saveStatus: 'idle' });
            }, 2000);
        } catch (error) {
            console.error('Failed to save settings:', error);
            set({ saveStatus: 'error' });
            setTimeout(() => {
                set({ saveStatus: 'idle' });
            }, 2000);
        }
    },

    loadSettings: async () => {
        set({ isLoading: true });
        try {
            const settings = await loadLLMSettings();
            set({ settings, isLoading: false });
        } catch (error) {
            console.error('Failed to load settings:', error);
            set({ isLoading: false });
        }
    },
}));