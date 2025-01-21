import { LoginButton } from '@/components/auth/LoginButton';
import { UserProfile } from '@/components/auth/UserProfile';
import { useLLMSettings } from '@/store/llmSettings';
import { useEffect, useState } from 'react';
import Warning from '../Warning';

export default function OptionsView({ onClose }: { onClose: () => void }) {
    const { settings, saveStatus, validationErrors, setSettings, saveSettings } = useLLMSettings();
    const [apiKey, setApiKey] = useState(settings.apiKey || '');
    const [apiBase, setApiBase] = useState(settings.apiBase || 'https://api.openai.com/v1');
    const [modelName, setModelName] = useState(settings.modelName || 'deepseek-chat');

    useEffect(() => {
        setApiKey(settings.apiKey || '');
        setApiBase(settings.apiBase || 'https://api.openai.com/v1');
        setModelName(settings.modelName || 'deepseek-chat');
    }, [settings]);

    const getFieldError = (fieldName: string) => {
        return validationErrors.find(error => error.field === fieldName)?.message;
    };

    const handleSave = async () => {
        setSettings({
            apiKey,
            apiBase,
            modelName,
        });
        await saveSettings();
        if (saveStatus === 'saved') {
            onClose();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <form className="bg-white rounded-xl shadow-md p-8 mb-4">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">LLM Settings</h1>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full"
                            aria-label="Close settings"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <UserProfile />
                        <LoginButton />
                    </div>

                    {!settings.apiKey && (
                        <Warning type="warning" title="API Key Required">
                            Please set your OpenAI API key to use AI-powered features.
                        </Warning>
                    )}

                    <div className="mb-6">
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                            API Key
                        </label>
                        <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border ${getFieldError('apiKey') ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors`}
                            placeholder="Enter your API key"
                            required
                            autoComplete="off"
                        />
                        {getFieldError('apiKey') && (
                            <p className="mt-2 text-sm text-red-600">{getFieldError('apiKey')}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="apiBase" className="block text-sm font-medium text-gray-700 mb-2">
                            API Base URL
                        </label>
                        <input
                            type="url"
                            id="apiBase"
                            value={apiBase}
                            onChange={(e) => setApiBase(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border ${getFieldError('apiBase') ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors`}
                            placeholder="https://api.openai.com/v1"
                            required
                        />
                        {getFieldError('apiBase') && (
                            <p className="mt-2 text-sm text-red-600">{getFieldError('apiBase')}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-2">
                            Model Name
                        </label>
                        <input
                            type="text"
                            id="modelName"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border ${getFieldError('modelName') ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors`}
                            placeholder="deepseek-chat"
                            required
                        />
                        {getFieldError('modelName') && (
                            <p className="mt-2 text-sm text-red-600">{getFieldError('modelName')}</p>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="w-full py-3.5 px-4 mt-4 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {saveStatus === 'saving' ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Settings'
                        )}
                    </button>

                    {saveStatus === 'saved' && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 text-sm font-medium rounded-lg text-center">
                            Settings saved successfully!
                        </div>
                    )}
                    {saveStatus === 'error' && validationErrors.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm font-medium rounded-lg">
                            <p className="text-center mb-2">Please fix the following errors:</p>
                            <ul className="list-disc list-inside">
                                {validationErrors.map((error, index) => (
                                    <li key={index}>{error.message}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {saveStatus === 'error' && validationErrors.length === 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm font-medium rounded-lg text-center">
                            Failed to save settings. Please try again.
                        </div>
                    )}
                </form>

                <div className="text-center text-sm text-gray-600">
                    <a
                        href="PRIVACY.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-600 hover:underline"
                    >
                        Privacy Policy
                    </a>
                </div>
            </div>
        </div>
    );
}