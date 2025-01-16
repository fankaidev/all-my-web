import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ScriptList from '../../../src/pages/panel/ScriptList';
import { Script } from '../../../src/types/script';
import { createChromeMock } from '../../setup/chrome';

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

    beforeEach(() => {
        vi.clearAllMocks();
        // Set up initial tab URL
        const chromeMock = chrome as unknown as ChromeMock;
        const tab = Array.from(chromeMock.tabs._tabs.values())[0];
        tab.url = 'https://example.com/page1';
    });

    it('should show Matched tag for matching scripts', async () => {
        await act(async () => {
            render(
                <ScriptList
                    scripts={mockScripts}
                    onEdit={mockHandlers.onEdit}
                    onDelete={mockHandlers.onDelete}
                    onTogglePause={mockHandlers.onTogglePause}
                />
            );
        });

        expect(screen.queryAllByText('Matched')).toHaveLength(1);
        expect(screen.queryAllByText('Skipped')).toHaveLength(1);
        expect(screen.queryAllByText('Paused')).toHaveLength(1);
    });

    it('should not show Matched tag for non-matching scripts', async () => {
        // Change mock tab URL
        const chromeMock = chrome as unknown as ChromeMock;
        const tab = Array.from(chromeMock.tabs._tabs.values())[0];
        tab.url = 'https://other.com/page1';
        (chromeMock.tabs.onUpdated as any).trigger(tab.id!, { status: 'complete' }, tab);

        await act(async () => {
            render(
                <ScriptList
                    scripts={mockScripts}
                    onEdit={mockHandlers.onEdit}
                    onDelete={mockHandlers.onDelete}
                    onTogglePause={mockHandlers.onTogglePause}
                />
            );
        });

        // No scripts should be active
        expect(screen.queryByText('Matched')).not.toBeInTheDocument();
    });

    it('should not show Matched tag for paused scripts', async () => {
        await act(async () => {
            render(
                <ScriptList
                    scripts={mockScripts}
                    onEdit={mockHandlers.onEdit}
                    onDelete={mockHandlers.onDelete}
                    onTogglePause={mockHandlers.onTogglePause}
                />
            );
        });

        // Paused script should not show Matched tag even if URL matches
        const pausedScript = screen.getByText('Paused Script').closest('div[class*="bg-white"]');
        expect(pausedScript).toHaveTextContent('Paused');
    });

    it('should update Matched tags when URL changes', async () => {
        await act(async () => {
            render(
                <ScriptList
                    scripts={mockScripts}
                    onEdit={mockHandlers.onEdit}
                    onDelete={mockHandlers.onDelete}
                    onTogglePause={mockHandlers.onTogglePause}
                />
            );
        });

        // Wait for initial render
        await vi.waitFor(() => {
            expect(screen.getByText('Example Script')).toBeInTheDocument();
            expect(screen.getByText('Matched')).toBeInTheDocument();
        });

        // Change mock tab URL to test.com
        const chromeMock = chrome as unknown as ChromeMock;
        const tab = Array.from(chromeMock.tabs._tabs.values())[0];
        tab.url = 'https://test.com/page1';
        (chromeMock.tabs.onUpdated as any).trigger(tab.id!, { status: 'complete' }, tab);

        // Now test.com script should be active
        await vi.waitFor(() => {
            const testScript = screen.getByText('Test Script').closest('div[class*="bg-white"]');
            expect(testScript).toHaveTextContent('Matched');
        });

        // example.com script should not be active
        const exampleScript = screen.getByText('Example Script').closest('div[class*="bg-white"]');
        expect(exampleScript).not.toHaveTextContent('Matched');
    });

});