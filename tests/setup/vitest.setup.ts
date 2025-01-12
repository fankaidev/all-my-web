import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { createChromeMock, resetChromeMocks } from './chrome';

// Run cleanup after each test case
afterEach(() => {
    cleanup();
});

// Setup Chrome API mock
const chromeMock = createChromeMock();
vi.stubGlobal('chrome', chromeMock);

// Reset mocks before each test
beforeEach(() => {
    resetChromeMocks(chromeMock);
});