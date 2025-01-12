import React, { useEffect, useState } from 'react';
import { Script } from '../../types/script';
import { extractMatchPatterns } from '../../utils/scriptParser';
import { getCurrentTab } from '../../utils/tabs';

interface ScriptListProps {
    scripts: Script[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onTogglePause: (id: number) => void;
}

const ScriptList: React.FC<ScriptListProps> = ({ scripts, onEdit, onDelete, onTogglePause }) => {
    const [currentUrl, setCurrentUrl] = useState<string | null>(null);

    // Update current URL when tab changes
    useEffect(() => {
        const updateCurrentUrl = async () => {
            const tab = await getCurrentTab();
            setCurrentUrl(tab?.url || null);
        };

        // Initial URL
        updateCurrentUrl();

        // Listen for tab changes
        const tabUpdateListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
            if (changeInfo.status === 'complete' && tab.active) {
                updateCurrentUrl();
            }
        };

        const tabActivatedListener = async (activeInfo: chrome.tabs.TabActiveInfo) => {
            const tab = await chrome.tabs.get(activeInfo.tabId);
            setCurrentUrl(tab.url || null);
        };

        chrome.tabs.onUpdated.addListener(tabUpdateListener);
        chrome.tabs.onActivated.addListener(tabActivatedListener);

        return () => {
            chrome.tabs.onUpdated.removeListener(tabUpdateListener);
            chrome.tabs.onActivated.removeListener(tabActivatedListener);
        };
    }, []);

    // Check if a script matches the current URL
    const isScriptMatched = (script: Script): boolean => {
        if (!currentUrl || script.isPaused) return false;
        const patterns = extractMatchPatterns(script.body);
        return patterns.some(pattern => currentUrl.match(pattern.replace(/\*/g, '.*')));
    };

    return (
        <div className="flex-1 bg-gray-50 rounded-lg p-2 overflow-y-auto">
            {scripts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg">No scripts yet</p>
                    <p className="text-sm">Click the Add Script button to create one</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {scripts.map(script => {
                        const matched = isScriptMatched(script);
                        return (
                            <div
                                key={script.id}
                                className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${script.isPaused ? 'opacity-75' : ''}`}
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-gray-800">{script.name}</h3>
                                            {script.isPaused && (
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                                    Paused
                                                </span>
                                            )}
                                            {matched && !script.isPaused && (
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                                    Matched
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onTogglePause(script.id)}
                                                className="p-2 text-gray-600 hover:text-yellow-500 transition-colors"
                                                title={script.isPaused ? "Resume script" : "Pause script"}
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {script.isPaused ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M19 12a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6 M19 12a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    )}
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onEdit(script.id)}
                                                className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                                                title="Edit script"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onDelete(script.id)}
                                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                title="Delete script"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {extractMatchPatterns(script.body).map((pattern, index) => (
                                            <span key={index} className="inline-flex items-center px-2 py-1 mr-2 mb-1 bg-gray-50 text-gray-600 rounded">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                                {pattern}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ScriptList;