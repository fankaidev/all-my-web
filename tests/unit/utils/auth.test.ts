import { getAuthToken, getUserInfo, revokeAuthToken, validateToken } from '@/utils/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Auth utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    describe('getAuthToken', () => {
        it('should return token when successful', async () => {
            const token = await getAuthToken();
            expect(token).toBe('mock-token');
            expect(chrome.identity.getAuthToken).toHaveBeenCalledWith(
                { interactive: true },
                expect.any(Function)
            );
        });

        it('should handle chrome runtime error', async () => {
            vi.mocked(chrome.identity.getAuthToken).mockImplementationOnce((_, callback) => {
                chrome.runtime.lastError = { message: 'Test error' };
                callback(undefined);
            });

            await expect(getAuthToken()).rejects.toThrow('Test error');
        });
    });

    describe('revokeAuthToken', () => {
        it('should revoke token successfully', async () => {
            await revokeAuthToken('test-token');
            expect(chrome.identity.removeCachedAuthToken).toHaveBeenCalledWith(
                { token: 'test-token' },
                expect.any(Function)
            );
        });

        it('should handle chrome runtime error', async () => {
            vi.mocked(chrome.identity.removeCachedAuthToken).mockImplementationOnce((_, callback) => {
                chrome.runtime.lastError = { message: 'Test error' };
                callback();
            });

            await expect(revokeAuthToken('test-token')).rejects.toThrow('Test error');
        });
    });

    describe('getUserInfo', () => {
        it('should fetch and return user info', async () => {
            const mockUserInfo = {
                id: '123',
                email: 'test@example.com',
                name: 'Test User',
                picture: 'https://example.com/pic.jpg',
            };

            (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockUserInfo),
            });

            const result = await getUserInfo('test-token');
            expect(result).toEqual(mockUserInfo);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                {
                    headers: {
                        Authorization: 'Bearer test-token',
                    },
                }
            );
        });

        it('should handle fetch error', async () => {
            (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
            });

            await expect(getUserInfo('test-token')).rejects.toThrow('Failed to fetch user info');
        });
    });

    describe('validateToken', () => {
        it('should return true for valid token', async () => {
            (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
            });

            const result = await validateToken('test-token');
            expect(result).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://www.googleapis.com/oauth2/v1/tokeninfo',
                {
                    headers: {
                        Authorization: 'Bearer test-token',
                    },
                }
            );
        });

        it('should return false for invalid token', async () => {
            (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
            });

            const result = await validateToken('test-token');
            expect(result).toBe(false);
        });

        it('should return false on fetch error', async () => {
            (global.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

            const result = await validateToken('test-token');
            expect(result).toBe(false);
        });
    });
});