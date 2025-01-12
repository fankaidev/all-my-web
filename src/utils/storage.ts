import { LLMSettings } from '../types/settings';

const STORAGE_KEYS = {
    LLM_SETTINGS: 'llm_settings',
} as const;

/**
 * Save LLM settings to chrome.storage.sync
 */
export async function saveLLMSettings(settings: LLMSettings): Promise<void> {
    try {
        await chrome.storage.sync.set({
            [STORAGE_KEYS.LLM_SETTINGS]: settings,
        });
    } catch (error) {
        console.error('Failed to save LLM settings:', error);
        throw error;
    }
}

/**
 * Load LLM settings from chrome.storage.sync
 * Returns default settings if not found
 */
export async function loadLLMSettings(): Promise<LLMSettings> {
    try {
        const result = await chrome.storage.sync.get([STORAGE_KEYS.LLM_SETTINGS]);
        return result[STORAGE_KEYS.LLM_SETTINGS] || {
            apiKey: '',
            apiBase: 'https://api.openai.com/v1',
        };
    } catch (error) {
        console.error('Failed to load LLM settings:', error);
        throw error;
    }
}

/**
 * Clear LLM settings from chrome.storage.sync
 */
export async function clearLLMSettings(): Promise<void> {
    try {
        await chrome.storage.sync.remove([STORAGE_KEYS.LLM_SETTINGS]);
    } catch (error) {
        console.error('Failed to clear LLM settings:', error);
        throw error;
    }
}