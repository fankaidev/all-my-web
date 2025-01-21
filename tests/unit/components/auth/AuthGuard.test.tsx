import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuthStore } from '@/store/authStore';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/store/authStore', () => ({
    useAuthStore: vi.fn(),
}));

describe('AuthGuard', () => {
    const mockValidateSession = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            token: null,
            identity: null,
            error: null,
            login: vi.fn(),
            logout: vi.fn(),
            validateSession: mockValidateSession,
        });
    });

    it('should render loading state', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            token: null,
            identity: null,
            error: null,
            login: vi.fn(),
            logout: vi.fn(),
            validateSession: mockValidateSession,
        });

        render(<AuthGuard>Protected Content</AuthGuard>);
        expect(screen.getByText('Verifying authentication...')).toBeInTheDocument();
    });

    it('should render custom loading fallback', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            token: null,
            identity: null,
            error: null,
            login: vi.fn(),
            logout: vi.fn(),
            validateSession: mockValidateSession,
        });

        render(
            <AuthGuard loadingFallback={<div>Custom Loading...</div>}>
                Protected Content
            </AuthGuard>
        );
        expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });

    it('should render unauthenticated state', () => {
        render(<AuthGuard>Protected Content</AuthGuard>);
        expect(screen.getByText('Please sign in to continue')).toBeInTheDocument();
    });

    it('should render custom fallback when unauthenticated', () => {
        render(
            <AuthGuard fallback={<div>Custom Fallback</div>}>
                Protected Content
            </AuthGuard>
        );
        expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
    });

    it('should render children when authenticated', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            token: 'test-token',
            identity: {
                id: '123',
                email: 'test@example.com',
                name: 'Test User',
                picture: 'https://example.com/pic.jpg',
            },
            error: null,
            login: vi.fn(),
            logout: vi.fn(),
            validateSession: mockValidateSession,
        });

        render(<AuthGuard>Protected Content</AuthGuard>);
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should call validateSession on mount', () => {
        render(<AuthGuard>Protected Content</AuthGuard>);
        expect(mockValidateSession).toHaveBeenCalled();
    });
});