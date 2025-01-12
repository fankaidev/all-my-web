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
