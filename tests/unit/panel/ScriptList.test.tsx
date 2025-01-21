import { screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ScriptList from '../../../src/pages/panel/ScriptList';
import { Script } from '../../../src/types/script';
import { createChromeMock } from '../../setup/chrome';
import { renderWithUser } from '../../setup/test-utils';

// Get the type of chrome mock for type assertions
type ChromeMock = ReturnType<typeof createChromeMock>;

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

    beforeEach(async () => {
        vi.clearAllMocks();
        // Reset Chrome mocks
        const chromeMock = chrome as unknown as ChromeMock;
        chromeMock.tabs._tabs.clear();
    });

    // Basic UI tests
    it('should render list of scripts', () => {
        renderWithUser(
            <ScriptList
                scripts={mockScripts}
                {...mockHandlers}
            />
        );

        // Check if script names are rendered
        expect(screen.getByText('Example Script')).toBeInTheDocument();
        expect(screen.getByText('Test Script')).toBeInTheDocument();
        expect(screen.getByText('Paused Script')).toBeInTheDocument();
    });

    it('should handle script deletion', async () => {
        const { user } = renderWithUser(
            <ScriptList
                scripts={mockScripts}
                {...mockHandlers}
            />
        );

        // Click delete button
        const deleteButton = screen.getAllByTitle('Delete script')[0];
        await user.click(deleteButton);

        // Verify handler was called
        expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
    });

    it('should handle script toggle', async () => {
        const { user } = renderWithUser(
            <ScriptList
                scripts={mockScripts}
                {...mockHandlers}
            />
        );

        // Click pause button for first script
        const pauseButton = screen.getAllByTitle('Pause script')[0];
        await user.click(pauseButton);

        // Verify handler was called
        expect(mockHandlers.onTogglePause).toHaveBeenCalledWith(1);
    });

    // URL matching tests
    it('should show Matched tag for matching scripts', async () => {
        const chromeMock = chrome as unknown as ChromeMock;
        const tab = await chromeMock.tabs.create({
            url: 'https://example.com/',
            active: true,
            windowId: 1,
        });
        console.log('[test] Created mock tab:', tab);

        // Mock query to return our tab
        chromeMock.tabs.query.mockResolvedValue([tab]);
        console.log('[test] Mocked query to return tab');

        renderWithUser(
            <ScriptList
                scripts={mockScripts}
                {...mockHandlers}
            />
        );
        console.log('[test] Rendered ScriptList');

        // Wait for state updates
        await vi.waitFor(() => {
            console.log('[test] Checking for Matched tag');
            expect(screen.getByText('Example Script')).toBeInTheDocument();
            expect(screen.getByText('Matched')).toBeInTheDocument();
        }, { timeout: 2000 });

        expect(screen.queryAllByText('Skipped')).toHaveLength(1);
        expect(screen.queryAllByText('Paused')).toHaveLength(1);
    });

    it('should not show Matched tag for non-matching scripts', async () => {
        const chromeMock = chrome as unknown as ChromeMock;
        const tab = await chromeMock.tabs.create({
            url: 'https://other.com/page1',
            active: true,
            windowId: 1,
        });

        // Mock query to return our tab
        chromeMock.tabs.query.mockResolvedValue([tab]);

        renderWithUser(
            <ScriptList
                scripts={mockScripts}
                {...mockHandlers}
            />
        );

        // Wait for state updates
        await vi.waitFor(() => {
            expect(screen.getByText('Example Script')).toBeInTheDocument();
            expect(screen.queryByText('Matched')).not.toBeInTheDocument();
        });
    });

    it('should not show Matched tag for paused scripts', async () => {
        const chromeMock = chrome as unknown as ChromeMock;
        const tab = await chromeMock.tabs.create({
            url: 'https://example.com/page1',
            active: true,
            windowId: 1,
        });

        // Mock query to return our tab
        chromeMock.tabs.query.mockResolvedValue([tab]);

        renderWithUser(
            <ScriptList
                scripts={mockScripts}
                {...mockHandlers}
            />
        );

        // Wait for state updates
        await vi.waitFor(() => {
            expect(screen.getByText('Paused Script')).toBeInTheDocument();
            const pausedScript = screen.getByText('Paused Script').closest('div[class*="bg-gray-50"]');
            expect(pausedScript).toHaveTextContent('Paused');
            expect(pausedScript).not.toHaveTextContent('Matched');
        });
    });

});