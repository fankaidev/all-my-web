import { LoginButton } from '@/components/auth/LoginButton';
import { useAuthStore } from '@/store/authStore';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/store/authStore', () => ({
    useAuthStore: vi.fn(),
}));

describe('LoginButton', () => {
    const mockLogin = vi.fn();
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuthStore).mockReturnValue({
            login: mockLogin,
            logout: mockLogout,
            isAuthenticated: false,
            isLoading: false,
            token: null,
            identity: null,
            error: null,
            validateSession: vi.fn(),
        });
    });

    it('should render sign in button when not authenticated', () => {
        render(<LoginButton />);
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    });

    it('should render sign out button when authenticated', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            login: mockLogin,
            logout: mockLogout,
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
            validateSession: vi.fn(),
        });

        render(<LoginButton />);
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('should render loading state', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            login: mockLogin,
            logout: mockLogout,
            isAuthenticated: false,
            isLoading: true,
            token: null,
            identity: null,
            error: null,
            validateSession: vi.fn(),
        });

        render(<LoginButton />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should call login when sign in button is clicked', async () => {
        render(<LoginButton />);
        await userEvent.click(screen.getByText('Sign in with Google'));
        expect(mockLogin).toHaveBeenCalled();
    });

    it('should call logout when sign out button is clicked', async () => {
        vi.mocked(useAuthStore).mockReturnValue({
            login: mockLogin,
            logout: mockLogout,
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
            validateSession: vi.fn(),
        });

        render(<LoginButton />);
        await userEvent.click(screen.getByText('Sign Out'));
        expect(mockLogout).toHaveBeenCalled();
    });
});