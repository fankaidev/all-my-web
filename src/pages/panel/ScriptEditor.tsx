import { PageContext } from '@src/utils/pageContext';
import React, { useEffect, useRef, useState } from 'react';
import Warning from '../../components/Warning';
import { useLLMSettings } from '../../store/llmSettings';
import { Script } from '../../types/script';
import { useLLM } from '../../utils/llm';
import { GEN_SCRIPT_PROMPT } from '../../utils/prompts';

interface ScriptEditorProps {
    script: Script;
    onSave: (id: number, name: string, requirement: string, body: string) => void;
    onCancel: () => void;
}

const getPageContext = async (): Promise<PageContext> => {
    const response = await chrome.runtime.sendMessage({ type: 'GET_PAGE_CONTEXT' });
    if (!response.success) {
        throw new Error(response.error || 'Failed to get page context');
    }
    return response.data;
};

const ScriptEditor: React.FC<ScriptEditorProps> = ({ script, onSave, onCancel }) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const requirementRef = useRef<HTMLTextAreaElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const { settings, loadSettings } = useLLMSettings();
    const { generate, generating } = useLLM();
    const [error, setError] = useState<string | null>(null);
    const [pageUrl, setPageUrl] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
        if (nameRef.current) {
            nameRef.current.focus();
        }
        // Get current page URL
        getPageContext().then(context => {
            if (context?.url) {
                setPageUrl(context.url);
            }
        }).catch(console.error);
    }, [loadSettings]);

    const handleSave = () => {
        if (nameRef.current && requirementRef.current && bodyRef.current) {
            onSave(script.id, nameRef.current.value, requirementRef.current.value, bodyRef.current.value);
        }
    };

    const handleGenerate = async () => {
        setError(null);
        if (!requirementRef.current?.value) {
            setError('Please enter a requirement first');
            return;
        }

        try {
            const context = await getPageContext();
            if (!context) {
                setError('Failed to get page context');
                return;
            }
            const prompt = GEN_SCRIPT_PROMPT.replace('{requirement}', requirementRef.current.value)
                .replace('{context}', JSON.stringify(context));

            const raw = await generate({
                prompt,
            });

            if (raw.startsWith('```javascript') && raw.endsWith('```')) {
                const generatedCode = raw.replace(/```javascript\n|```/g, '');
                if (bodyRef.current) {
                    bodyRef.current.value = generatedCode;
                }
            } else {
                setError(raw);
            }
        } catch (err) {
            console.error('Failed to generate script:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        }
    };

    const isLLMConfigured = settings.apiKey && settings.modelName;

    return (
        <div className="flex-1 bg-gray-50 rounded-lg p-2">
            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
                {!isLLMConfigured && (
                    <Warning type="warning" title="LLM Settings Required">
                        Please configure LLM settings to use the script generation feature.
                        <ol className="list-decimal list-inside mt-2 ml-2">
                            <li>Click the extension icon and select "Options"</li>
                            <li>Enter your API Key, API Base URL, and Model Name</li>
                            <li>Save the settings and return to this page</li>
                        </ol>
                    </Warning>
                )}
                <div className="flex flex-col flex-1 min-h-0">
                    <div className="mb-4">
                        <input
                            ref={nameRef}
                            type="text"
                            defaultValue={script.name}
                            className="font-medium text-gray-800 border rounded px-2 py-1 w-64 mb-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSave();
                                } else if (e.key === 'Escape') {
                                    onCancel();
                                }
                            }}
                        />
                        <div className="text-sm text-gray-500 truncate">
                            {pageUrl || 'No URL detected'}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Requirement
                        </label>
                        <textarea
                            ref={requirementRef}
                            defaultValue={script.requirement}
                            className="w-full h-24 p-2 font-mono text-sm text-gray-600 bg-gray-50 rounded border focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Describe what you want this script to do, and then click Generate to generate the script."
                        />
                    </div>
                    <div className="flex flex-col flex-1 min-h-0">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Script Body
                        </label>
                        <div className="flex-1 min-h-0">
                            <textarea
                                ref={bodyRef}
                                defaultValue={script.body}
                                className="w-full h-full resize-none p-2 font-mono text-sm text-gray-600 bg-gray-50 rounded border focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        onCancel();
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm font-medium rounded-lg">
                        {error}
                    </div>
                )}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleGenerate}
                        disabled={generating || !isLLMConfigured}
                        className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 ${(generating || !isLLMConfigured) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={!isLLMConfigured ? "Configure LLM settings first" : "Generate script using AI"}
                    >
                        {generating ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Generate
                            </>
                        )}
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                            title="Save changes"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                            title="Cancel editing"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScriptEditor;