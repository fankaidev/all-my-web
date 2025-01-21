import { useAuthStore } from '@/store/authStore';
import * as authUtils from '@/utils/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/auth', () => ({
    getAuthToken: vi.fn(),
    getUserInfo: vi.fn(),
    revokeAuthToken: vi.fn(),
    validateToken: vi.fn(),
}));

describe('Auth Store', () => {
    const mockIdentity = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/pic.jpg',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.setState({
            token: null,
            identity: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    });

    describe('login', () => {
        it('should set auth state on successful login', async () => {
            vi.mocked(authUtils.getAuthToken).mockResolvedValue('test-token');
            vi.mocked(authUtils.getUserInfo).mockResolvedValue(mockIdentity);

            await useAuthStore.getState().login();

            expect(useAuthStore.getState()).toMatchObject({
                token: 'test-token',
                identity: mockIdentity,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        });

        it('should handle login error', async () => {
            vi.mocked(authUtils.getAuthToken).mockRejectedValue(new Error('Login failed'));

            await useAuthStore.getState().login();

            expect(useAuthStore.getState()).toMatchObject({
                token: null,
                identity: null,
                isAuthenticated: false,
                isLoading: false,
                error: 'Login failed',
            });
        });
    });

    describe('logout', () => {
        it('should clear auth state on successful logout', async () => {
            useAuthStore.setState({
                token: 'test-token',
                identity: mockIdentity,
                isAuthenticated: true,
            });

            await useAuthStore.getState().logout();

            expect(useAuthStore.getState()).toMatchObject({
                token: null,
                identity: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
            expect(authUtils.revokeAuthToken).toHaveBeenCalledWith('test-token');
        });

        it('should handle logout error', async () => {
            useAuthStore.setState({
                token: 'test-token',
                identity: mockIdentity,
                isAuthenticated: true,
            });

            vi.mocked(authUtils.revokeAuthToken).mockRejectedValue(new Error('Logout failed'));

            await useAuthStore.getState().logout();

            expect(useAuthStore.getState()).toMatchObject({
                token: 'test-token',
                identity: mockIdentity,
                isAuthenticated: true,
                isLoading: false,
                error: 'Logout failed',
            });
        });
    });

    describe('validateSession', () => {
        it('should clear session if no token exists', async () => {
            useAuthStore.setState({
                token: null,
                identity: mockIdentity,
                isAuthenticated: true,
            });

            await useAuthStore.getState().validateSession();

            expect(useAuthStore.getState()).toMatchObject({
                token: null,
                identity: null,
                isAuthenticated: false,
            });
        });

        it('should clear session if token is invalid', async () => {
            useAuthStore.setState({
                token: 'test-token',
                identity: mockIdentity,
                isAuthenticated: true,
            });

            vi.mocked(authUtils.validateToken).mockResolvedValue(false);

            await useAuthStore.getState().validateSession();

            expect(useAuthStore.getState()).toMatchObject({
                token: null,
                identity: null,
                isAuthenticated: false,
            });
        });

        it('should refresh user info if token is valid', async () => {
            useAuthStore.setState({
                token: 'test-token',
                identity: { ...mockIdentity, name: 'Old Name' },
                isAuthenticated: true,
            });

            vi.mocked(authUtils.validateToken).mockResolvedValue(true);
            vi.mocked(authUtils.getUserInfo).mockResolvedValue(mockIdentity);

            await useAuthStore.getState().validateSession();

            expect(useAuthStore.getState()).toMatchObject({
                token: 'test-token',
                identity: mockIdentity,
                isAuthenticated: true,
            });
        });

        it('should clear session on validation error', async () => {
            useAuthStore.setState({
                token: 'test-token',
                identity: mockIdentity,
                isAuthenticated: true,
            });

            vi.mocked(authUtils.validateToken).mockRejectedValue(new Error('Validation failed'));

            await useAuthStore.getState().validateSession();

            expect(useAuthStore.getState()).toMatchObject({
                token: null,
                identity: null,
                isAuthenticated: false,
            });
        });
    });
});