export interface ValidationError {
    field: string;
    message: string;
}

export interface LLMSettings {
    apiKey?: string;
    apiBase?: string;
    modelName?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}