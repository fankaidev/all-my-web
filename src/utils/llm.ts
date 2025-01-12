import { LLMSettings } from '../types/llm';

interface OpenAIResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        text: string;
        index: number;
        logprobs: null;
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export async function generateScript(requirement: string, settings: LLMSettings): Promise<string> {
    const prompt = `Generate a JavaScript code snippet that does the following:
${requirement}

Please provide only the code without any explanation or markdown formatting.
Make sure the response starts with "\`\`\`javascript" and ends with "\`\`\`".

`;

    try {
        const response = await fetch(`${settings.apiBase}/v1/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                prompt,
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate script');
        }

        const data: OpenAIResponse = await response.json();
        const raw = data.choices[0].text.trim();
        const script = raw.replace(/```javascript\n|```/g, '');
        return script;
    } catch (error) {
        console.error('Failed to generate script:', error);
        throw error;
    }
}