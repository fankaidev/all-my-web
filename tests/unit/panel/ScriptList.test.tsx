import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ScriptList from '../../../src/pages/panel/ScriptList';
import { Script } from '../../../src/types/script';

// Mock chrome API
const mockTabs = {
    query: vi.fn().mockResolvedValue([{ url: 'https://example.com/page1' }]),
    onUpdated: {
        addListener: vi.fn(),
        removeListener: vi.fn()
    },
    onActivated: {
        addListener: vi.fn(),
        removeListener: vi.fn()
    },
    get: vi.fn().mockResolvedValue({ url: 'https://example.com/page1' })
};

vi.mock('chrome', () => ({
    tabs: mockTabs
}));

describe('ScriptList', () => {
    const mockScripts: Script[] = [
        {
            id: 1,
            name: 'Example Script',
            body: '// @match https://example.com/*\nconsole.log("test")',
            requirement: '',
            isPaused: false
        },
        {
            id: 2,
            name: 'Test Script',
            body: '// @match https://test.com/*\nconsole.log("test")',
            requirement: '',
            isPaused: false
        },
        {
            id: 3,
            name: 'Paused Script',
            body: '// @match https://example.com/*\nconsole.log("test")',
            requirement: '',
            isPaused: true
        }
    ];

    const mockHandlers = {
        onEdit: vi.fn(),
        onDelete: vi.fn(),
        onTogglePause: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show Active tag for matching scripts', async () => {
        render(
            <ScriptList
                scripts={mockScripts}
                onEdit={mockHandlers.onEdit}
                onDelete={mockHandlers.onDelete}
                onTogglePause={mockHandlers.onTogglePause}
            />
        );

        // Wait for URL to be set
        await vi.waitFor(() => {
            expect(screen.getByText('Example Script')).toBeInTheDocument();
        });

        // First script should be active (matches example.com)
        expect(screen.getByText('Active')).toBeInTheDocument();

        // Should only show one Active tag
        expect(screen.queryAllByText('Active')).toHaveLength(1);
    });

    it('should not show Active tag for non-matching scripts', async () => {
        // Mock different URL
        mockTabs.query.mockResolvedValueOnce([
            { url: 'https://other.com/page1' }
        ]);

        render(
            <ScriptList
                scripts={mockScripts}
                onEdit={mockHandlers.onEdit}
                onDelete={mockHandlers.onDelete}
                onTogglePause={mockHandlers.onTogglePause}
            />
        );

        // Wait for URL to be set
        await vi.waitFor(() => {
            expect(screen.getByText('Example Script')).toBeInTheDocument();
        });

        // No scripts should be active
        expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });

    it('should not show Active tag for paused scripts', async () => {
        render(
            <ScriptList
                scripts={mockScripts}
                onEdit={mockHandlers.onEdit}
                onDelete={mockHandlers.onDelete}
                onTogglePause={mockHandlers.onTogglePause}
            />
        );

        // Wait for URL to be set
        await vi.waitFor(() => {
            expect(screen.getByText('Paused Script')).toBeInTheDocument();
        });

        // Paused script should show Paused tag
        expect(screen.getByText('Paused')).toBeInTheDocument();

        // Paused script should not show Active tag even if URL matches
        const pausedScript = screen.getByText('Paused Script').closest('div[class*="bg-white"]');
        expect(pausedScript).not.toHaveTextContent('Active');
    });

    it('should update Active tags when URL changes', async () => {
        const { rerender } = render(
            <ScriptList
                scripts={mockScripts}
                onEdit={mockHandlers.onEdit}
                onDelete={mockHandlers.onDelete}
                onTogglePause={mockHandlers.onTogglePause}
            />
        );

        // Wait for initial render
        await vi.waitFor(() => {
            expect(screen.getByText('Example Script')).toBeInTheDocument();
        });

        // Initially example.com script should be active
        expect(screen.getByText('Active')).toBeInTheDocument();

        // Mock URL change to test.com
        mockTabs.query.mockResolvedValueOnce([
            { url: 'https://test.com/page1' }
        ]);

        // Simulate tab update
        const tabUpdateListener = (mockTabs.onUpdated.addListener as any).mock.calls[0][0];
        await tabUpdateListener(1, { status: 'complete' }, { active: true });

        // Now test.com script should be active
        await vi.waitFor(() => {
            const testScript = screen.getByText('Test Script').closest('div[class*="bg-white"]');
            expect(testScript).toHaveTextContent('Active');
        });

        // example.com script should not be active
        const exampleScript = screen.getByText('Example Script').closest('div[class*="bg-white"]');
        expect(exampleScript).not.toHaveTextContent('Active');
    });
});