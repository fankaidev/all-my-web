import { create } from 'zustand';
import { LLMSettings } from '../types/settings';
import { loadLLMSettings, saveLLMSettings } from '../utils/storage';

interface ValidationError {
    field: keyof LLMSettings;
    message: string;
}

interface LLMSettingsState {
    settings: LLMSettings;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
    isLoading: boolean;
    validationErrors: ValidationError[];
    setSettings: (settings: Partial<LLMSettings>) => void;
    saveSettings: () => Promise<void>;
    loadSettings: () => Promise<void>;
    validateSettings: () => ValidationError[];
}

function validateApiKey(apiKey: string): string | null {
    if (!apiKey) {
        return 'API Key is required';
    }

    return null;
}

function validateApiBase(apiBase: string): string | null {
    if (!apiBase) {
        return 'API Base URL is required';
    }
    try {
        new URL(apiBase);
    } catch {
        return 'Invalid URL format';
    }
    if (!apiBase.startsWith('http://') && !apiBase.startsWith('https://')) {
        return 'URL must start with http:// or https://';
    }
    return null;
}

export const useLLMSettings = create<LLMSettingsState>((set, get) => ({
    settings: {
        apiKey: '',
        apiBase: '',
    },
    saveStatus: 'idle',
    isLoading: false,
    validationErrors: [],

    validateSettings: () => {
        const { settings } = get();
        const errors: ValidationError[] = [];

        const apiKeyError = validateApiKey(settings.apiKey);
        if (apiKeyError) {
            errors.push({ field: 'apiKey', message: apiKeyError });
        }

        const apiBaseError = validateApiBase(settings.apiBase);
        if (apiBaseError) {
            errors.push({ field: 'apiBase', message: apiBaseError });
        }

        set({ validationErrors: errors });
        return errors;
    },

    setSettings: (newSettings) => {
        set((state) => ({
            settings: {
                ...state.settings,
                ...newSettings,
            },
            validationErrors: [], // Clear validation errors when settings change
        }));
    },

    saveSettings: async () => {
        const errors = get().validateSettings();
        if (errors.length > 0) {
            set({ saveStatus: 'error' });
            setTimeout(() => {
                set({ saveStatus: 'idle' });
            }, 2000);
            return;
        }

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
        set({ isLoading: true, validationErrors: [] });
        try {
            const settings = await loadLLMSettings();
            set({ settings, isLoading: false });
        } catch (error) {
            console.error('Failed to load settings:', error);
            set({ isLoading: false });
        }
    },
}));