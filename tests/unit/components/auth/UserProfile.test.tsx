import { UserProfile } from '@/components/auth/UserProfile';
import { useAuthStore } from '@/store/authStore';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/store/authStore', () => ({
    useAuthStore: vi.fn(),
}));

describe('UserProfile', () => {
    const mockIdentity = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/pic.jpg',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render nothing when not authenticated', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            identity: null,
            isAuthenticated: false,
            isLoading: false,
            token: null,
            error: null,
            login: vi.fn(),
            logout: vi.fn(),
            validateSession: vi.fn(),
        });

        const { container } = render(<UserProfile />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render user info when authenticated', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            identity: mockIdentity,
            isAuthenticated: true,
            isLoading: false,
            token: 'test-token',
            error: null,
            login: vi.fn(),
            logout: vi.fn(),
            validateSession: vi.fn(),
        });

        render(<UserProfile />);
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByAltText('Test User')).toHaveAttribute('src', 'https://example.com/pic.jpg');
    });

    it('should render nothing when authenticated but identity is null', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            identity: null,
            isAuthenticated: true,
            isLoading: false,
            token: 'test-token',
            error: null,
            login: vi.fn(),
            logout: vi.fn(),
            validateSession: vi.fn(),
        });

        const { container } = render(<UserProfile />);
        expect(container).toBeEmptyDOMElement();
    });
});