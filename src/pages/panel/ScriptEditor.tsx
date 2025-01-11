import React, { useEffect, useRef } from 'react';
import { Script } from './ScriptManager';

interface ScriptEditorProps {
    script: Script;
    onSave: (id: number, name: string, body: string) => void;
    onCancel: () => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ script, onSave, onCancel }) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const handleSave = () => {
        if (nameRef.current && bodyRef.current) {
            onSave(script.id, nameRef.current.value, bodyRef.current.value);
        }
    };

    return (
        <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <input
                        ref={nameRef}
                        type="text"
                        defaultValue={script.name}
                        className="font-medium text-gray-800 border rounded px-2 py-1 w-64"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            } else if (e.key === 'Escape') {
                                onCancel();
                            }
                        }}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="p-2 text-gray-600 hover:text-green-500 transition-colors"
                            title="Save changes"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                        <button
                            onClick={onCancel}
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                            title="Cancel editing"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <textarea
                    ref={bodyRef}
                    defaultValue={script.body}
                    className="mt-2 p-2 w-full h-64 font-mono text-sm text-gray-600 bg-gray-50 rounded border focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            onCancel();
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ScriptEditor;