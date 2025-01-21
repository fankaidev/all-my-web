import { useState } from 'react';
import { useLLMSettings } from '../store/llmSettings';
import { LLMSettings } from '../types/settings';

interface OpenAIResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        message: {
            role: string;
            content: string;
        };
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

interface ChatCompletionRequest {
    prompt: string;
    model?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}

/**
 * Core function to call OpenAI completion API
 */
async function chatCompletions(request: ChatCompletionRequest, settings: LLMSettings): Promise<string> {
    try {
        const messages = [
            { role: 'user', content: request.prompt },
        ];
        const response = await fetch(`${settings.apiBase}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`,
            },
            body: JSON.stringify({
                model: request.model || settings.modelName,
                messages,
                max_tokens: request.max_tokens ?? 1000,
                temperature: request.temperature ?? 0.7,
                top_p: request.top_p ?? 1,
                frequency_penalty: request.frequency_penalty ?? 0,
                presence_penalty: request.presence_penalty ?? 0,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to call completion API');
        }

        const data: OpenAIResponse = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Failed to call completion API:', error);
        throw error;
    }
}

interface UseLLMResult {
    generate: (request: ChatCompletionRequest) => Promise<string>;
    generating: boolean;
    error: string | null;
}

/**
 * Hook for calling OpenAI completion API
 */
export function useLLM(): UseLLMResult {
    const { settings } = useLLMSettings();
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async (request: ChatCompletionRequest): Promise<string> => {
        if (!settings.apiKey) {
            throw new Error('Please configure OpenAI API key in extension options');
        }

        setGenerating(true);
        setError(null);

        try {
            const result = await chatCompletions(request, settings);
            console.log('result', result);
            return result;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to call completion API';
            setError(message);
            throw error;
        } finally {
            setGenerating(false);
        }
    };

    return {
        generate,
        generating,
        error,
    };
}

interface ScriptGenerationResponse {
    script: string;
}

interface ScriptGenerationRequest {
    user_request: string;
}

/**
 * Call script generation API to generate script
 */
export async function generateScript(request: ScriptGenerationRequest, token: string): Promise<string> {
    try {
        const response = await fetch('https://all-my-web-api.cloud6565.workers.dev/script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate script');
        }

        const data: ScriptGenerationResponse = await response.json();
        return data.script;
    } catch (error) {
        console.error('Failed to generate script:', error);
        throw error;
    }
}

interface UseScriptGenerationResult {
    generate: (request: ScriptGenerationRequest) => Promise<string>;
    generating: boolean;
    error: string | null;
}

/**
 * Hook for calling script generation API
 */
export function useScriptGeneration(token: string | null): UseScriptGenerationResult {
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async (request: ScriptGenerationRequest): Promise<string> => {
        if (!token) {
            throw new Error('Please sign in to use script generation');
        }

        setGenerating(true);
        setError(null);

        try {
            const result = await generateScript(request, token);
            return result;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to generate script';
            setError(message);
            throw error;
        } finally {
            setGenerating(false);
        }
    };

    return {
        generate,
        generating,
        error,
    };
}
