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
            setScripts(storedScripts);
            console.debug('[amw] Set scripts state:', storedScripts);
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
            body: 'console.log("hello")',
        };
        const updatedScripts = [...scripts, newScript];
        setScripts(updatedScripts);
        await saveToStorage(updatedScripts);
        return newScript;
    };

    const editScript = async (id: number, newName: string, newBody: string) => {
        const updatedScripts = scripts.map(script =>
            script.id === id
                ? { ...script, name: newName, body: newBody }
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
    };
};

export default useScripts;