import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateScript, useScriptGenerationApi } from '../../../src/utils/llm';

describe('generateScript', () => {
    const mockToken = 'test-token';
    const mockRequest = { user_request: 'test request' };
    const mockResponse = { script: 'test script' };

    beforeEach(() => {
        vi.resetAllMocks();
        global.fetch = vi.fn();
    });

    it('should call API with correct parameters', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        await generateScript(mockRequest, mockToken);

        expect(global.fetch).toHaveBeenCalledWith(
            'https://all-my-web-api.cloud6565.workers.dev/script',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${mockToken}`,
                },
                body: JSON.stringify(mockRequest),
            }
        );
    });

    it('should return script from response', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const result = await generateScript(mockRequest, mockToken);

        expect(result).toBe(mockResponse.script);
    });

    it('should throw error when API returns error', async () => {
        const errorMessage = 'API error';
        (global.fetch as any).mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: { message: errorMessage } }),
        });

        await expect(generateScript(mockRequest, mockToken)).rejects.toThrow(errorMessage);
    });

    it('should throw error when fetch fails', async () => {
        const errorMessage = 'Network error';
        (global.fetch as any).mockRejectedValueOnce(new Error(errorMessage));

        await expect(generateScript(mockRequest, mockToken)).rejects.toThrow();
    });
});

describe('useScriptGeneration', () => {
    const mockToken = 'test-token';
    const mockRequest = { user_request: 'test request' };
    const mockResponse = { script: 'test script' };

    beforeEach(() => {
        vi.resetAllMocks();
        global.fetch = vi.fn();
    });

    it('should return initial state', () => {
        const { result } = renderHook(() => useScriptGenerationApi(mockToken));

        expect(result.current.generating).toBe(false);
        expect(result.current.error).toBe(null);
        expect(typeof result.current.generate).toBe('function');
    });

    it('should generate script successfully', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const { result } = renderHook(() => useScriptGenerationApi(mockToken));

        let scriptResult: string | undefined;
        await act(async () => {
            scriptResult = await result.current.generate(mockRequest);
        });

        expect(scriptResult).toBe(mockResponse.script);
        expect(result.current.generating).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should handle error when token is not provided', async () => {
        const { result } = renderHook(() => useScriptGenerationApi(null));

        await expect(result.current.generate(mockRequest)).rejects.toThrow('Please sign in to use script generation');
    });

    it('should handle API error', async () => {
        const errorMessage = 'API error';
        (global.fetch as any).mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: { message: errorMessage } }),
        });

        const { result } = renderHook(() => useScriptGenerationApi(mockToken));

        await act(async () => {
            await expect(result.current.generate(mockRequest)).rejects.toThrow(errorMessage);
        });

        expect(result.current.generating).toBe(false);
        expect(result.current.error).toBe(errorMessage);
    });
});