import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import ScriptList from '../../../src/pages/panel/ScriptList';
import { Script } from '../../../src/types/script';
import { renderWithUser, screen } from '../../setup/test-utils';

const mockScripts: Script[] = [
    {
        id: 1,
        name: 'Test Script 1',
        requirement: 'Test requirement 1',
        body: 'console.log("test1")',
        isPaused: false,
    },
    {
        id: 2,
        name: 'Test Script 2',
        requirement: 'Test requirement 2',
        body: 'console.log("test2")',
        isPaused: true,
    },
];

const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onTogglePause: vi.fn(),
};

describe('ScriptList', () => {
    it('should render list of scripts', () => {
        renderWithUser(
            <ScriptList
                scripts={mockScripts}
                {...mockHandlers}
            />
        );

        // Check if script names are rendered
        expect(screen.getByText('Test Script 1')).toBeInTheDocument();
        expect(screen.getByText('Test Script 2')).toBeInTheDocument();
    });

    it('should show pause status', () => {
        renderWithUser(
            <ScriptList
                scripts={mockScripts}
                {...mockHandlers}
            />
        );

        // First script is active (no status badge)
        expect(screen.queryByText('Paused')).not.toBeNull();

        // Second script is paused
        expect(screen.getByText('Paused')).toBeInTheDocument();
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
        const pauseButton = screen.getByTitle('Pause script');
        await user.click(pauseButton);

        // Verify handler was called
        expect(mockHandlers.onTogglePause).toHaveBeenCalledWith(1);
    });
});