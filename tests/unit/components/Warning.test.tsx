import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import Warning from '../../../src/components/Warning';

describe('Warning', () => {
    it('renders warning message with default type', () => {
        render(<Warning>Test warning message</Warning>);
        expect(screen.getByRole('alert')).toHaveClass('bg-yellow-100');
        expect(screen.getByText('Test warning message')).toBeInTheDocument();
    });

    it('renders error type with title', () => {
        render(
            <Warning type="error" title="Error Title">
                Error message
            </Warning>
        );
        expect(screen.getByRole('alert')).toHaveClass('bg-red-100');
        expect(screen.getByText('Error Title')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('renders info type', () => {
        render(<Warning type="info">Info message</Warning>);
        expect(screen.getByRole('alert')).toHaveClass('bg-blue-100');
        expect(screen.getByText('Info message')).toBeInTheDocument();
    });
});