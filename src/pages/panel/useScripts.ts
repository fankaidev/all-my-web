import { useEffect, useState } from 'react';
import { Script } from './ScriptManager';

const useScripts = () => {
    const [scripts, setScripts] = useState<Script[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadScripts = async () => {
        try {
            const result = await chrome.storage.local.get('scripts');
            console.debug('[amw] Loaded scripts from storage:', result);
            const storedScripts = result.scripts || [];
            const updatedScripts = storedScripts.map((script: Script) => ({
                ...script,
                isPaused: script.isPaused || false
            }));
            setScripts(updatedScripts);
            console.debug('[amw] Set scripts state:', updatedScripts);
        } catch (err) {
            setError('Failed to load scripts');
            console.error('Error loading scripts:', err);
        } finally {
            setIsLoading(false);
        }
    };

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
        await saveToStorage(updatedScripts);
        return newScript;
    };

    const editScript = async (id: number, newName: string, newRequirement: string, newBody: string) => {
        const updatedScripts = scripts.map(script =>
            script.id === id
                ? { ...script, name: newName, requirement: newRequirement, body: newBody }
                : script
        );
        setScripts(updatedScripts);
        await saveToStorage(updatedScripts);
    };

    const deleteScript = async (id: number) => {
        const updatedScripts = scripts.filter(script => script.id !== id);
        setScripts(updatedScripts);
        await saveToStorage(updatedScripts);
    };

    const togglePause = async (id: number) => {
        try {
            const updatedScripts = scripts.map(script =>
                script.id === id
                    ? { ...script, isPaused: !script.isPaused }
                    : script
            );
            setScripts(updatedScripts);
            await saveToStorage(updatedScripts);
        } catch (err) {
            setError('Failed to toggle script pause state');
            console.error('Error toggling script pause state:', err);
        }
    };

    useEffect(() => {
        loadScripts();
    }, []);

    return {
        scripts,
        isLoading,
        error,
        addScript,
        editScript,
        deleteScript,
        togglePause,
    };
};

export default useScripts;