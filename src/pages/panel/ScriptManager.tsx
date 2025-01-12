import React, { useEffect, useState } from 'react';

export interface Script {
    id: number;
    name: string;
    requirement: string;
    body: string;
    isPaused?: boolean;  // Optional for backward compatibility
}

const ScriptManager: React.FC = () => {
    const [scripts, setScripts] = useState<Script[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load scripts from storage on mount
    useEffect(() => {
        const loadScripts = async () => {
            try {
                const result = await chrome.storage.local.get('scripts');
                const storedScripts = result.scripts || [];
                setScripts(storedScripts);
            } catch (err) {
                setError('Failed to load scripts');
                console.error('Error loading scripts:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadScripts();
    }, []);

    const saveToStorage = async (updatedScripts: Script[]) => {
        try {
            await chrome.storage.local.set({ scripts: updatedScripts });
        } catch (err) {
            setError('Failed to save scripts');
            console.error('Error saving scripts:', err);
        }
    };

    const addScript = async () => {
        const newScript: Script = {
            id: scripts.length ? scripts[scripts.length - 1].id + 1 : 1,
            name: 'New Script',
            requirement: '',
            body: 'console.log("hello")',
        };
        const updatedScripts = [...scripts, newScript];
        setScripts(updatedScripts);
        setEditingId(newScript.id);
        await saveToStorage(updatedScripts);
    };

    const editScript = (id: number) => {
        setEditingId(id);
    };

    const saveScript = async (id: number, newName: string, newBody: string) => {
        const updatedScripts = scripts.map(script =>
            script.id === id
                ? { ...script, name: newName, body: newBody }
                : script
        );
        setScripts(updatedScripts);
        setEditingId(null);
        await saveToStorage(updatedScripts);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const deleteScript = async (id: number) => {
        const updatedScripts = scripts.filter(script => script.id !== id);
        setScripts(updatedScripts);
        await saveToStorage(updatedScripts);
    };

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center">Loading scripts...</div>;
    }

    if (error) {
        return <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-700">Scripts</h2>
                <button
                    onClick={addScript}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Script
                </button>
            </div>

            <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto">
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
                        {scripts.map(script => (
                            <div
                                key={script.id}
                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-center">
                                    {editingId === script.id ? (
                                        <input
                                            id={`script-name-${script.id}`}
                                            type="text"
                                            defaultValue={script.name}
                                            className="font-medium text-gray-800 border rounded px-2 py-1 w-64"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const target = e.target as HTMLInputElement;
                                                    const bodyElement = document.getElementById(`script-body-${script.id}`) as HTMLTextAreaElement;
                                                    saveScript(script.id, target.value, bodyElement.value);
                                                } else if (e.key === 'Escape') {
                                                    cancelEdit();
                                                }
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <h3 className="font-medium text-gray-800">{script.name}</h3>
                                    )}
                                    <div className="flex gap-2">
                                        {editingId === script.id ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        console.debug('Save button clicked');
                                                        const nameElement = document.getElementById(`script-name-${script.id}`) as HTMLInputElement;
                                                        const bodyElement = document.getElementById(`script-body-${script.id}`) as HTMLTextAreaElement;
                                                        saveScript(script.id, nameElement.value, bodyElement.value);
                                                    }}
                                                    className="p-2 text-gray-600 hover:text-green-500 transition-colors"
                                                    title="Save changes"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                    title="Cancel editing"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => editScript(script.id)}
                                                    className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                                                    title="Edit script"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => deleteScript(script.id)}
                                                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                    title="Delete script"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {editingId === script.id ? (
                                    <textarea
                                        id={`script-body-${script.id}`}
                                        defaultValue={script.body}
                                        className="mt-2 p-2 w-full h-32 font-mono text-sm text-gray-600 bg-gray-50 rounded border focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                                cancelEdit();
                                            }
                                        }}
                                    />
                                ) : (
                                    <pre className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600 overflow-x-auto">
                                        {script.body}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScriptManager;