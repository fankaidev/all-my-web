import { LLMSettings, ValidationError } from '@/types/llm';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LLMStore {
    settings: LLMSettings;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
    validationErrors: ValidationError[];
    updateSettings: (settings: LLMSettings) => Promise<void>;
}

const validateSettings = (settings: LLMSettings): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!settings.apiKey) {
        errors.push({ field: 'apiKey', message: 'API Key is required' });
    }

    if (!settings.apiBase) {
        errors.push({ field: 'apiBase', message: 'API Base URL is required' });
    } else {
        try {
            new URL(settings.apiBase);
        } catch {
            errors.push({ field: 'apiBase', message: 'Invalid URL format' });
        }
    }

    if (!settings.modelName) {
        errors.push({ field: 'modelName', message: 'Model Name is required' });
    }

    return errors;
};

const useLLMStore = create<LLMStore>()(
    persist(
        (set) => ({
            settings: {
                apiBase: 'https://api.openai.com/v1',
            },
            saveStatus: 'idle',
            validationErrors: [],
            updateSettings: async (newSettings) => {
                set({ saveStatus: 'saving' });
                try {
                    const errors = validateSettings(newSettings);
                    if (errors.length > 0) {
                        set({ saveStatus: 'error', validationErrors: errors });
                        return;
                    }
                    set({ settings: newSettings, saveStatus: 'saved', validationErrors: [] });
                    setTimeout(() => set({ saveStatus: 'idle' }), 2000);
                } catch (error) {
                    set({ saveStatus: 'error', validationErrors: [] });
                    setTimeout(() => set({ saveStatus: 'idle' }), 2000);
                }
            },
        }),
        {
            name: 'llm-settings',
        }
    )
);

export default useLLMStore;