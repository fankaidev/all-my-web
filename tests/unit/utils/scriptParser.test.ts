import { describe, expect, it } from 'vitest';
import { extractMatchPatterns, extractRunAt, isValidMatchPattern } from '../../../src/utils/scriptParser';

describe('scriptParser', () => {
    describe('isValidMatchPattern', () => {
        it('should validate special patterns', () => {
            expect(isValidMatchPattern('*://*/*')).toBe(true);
            expect(isValidMatchPattern('<all_urls>')).toBe(true);
        });

        it('should validate domain patterns', () => {
            expect(isValidMatchPattern('https://*.example.com/*')).toBe(true);
            expect(isValidMatchPattern('http://specific.site.com/path/*')).toBe(true);
        });

        it('should reject invalid patterns', () => {
            expect(isValidMatchPattern('invalid')).toBe(false);
            expect(isValidMatchPattern('http://')).toBe(false);
            expect(isValidMatchPattern('*.example.com')).toBe(false);
        });
    });

    describe('extractMatchPatterns', () => {
        it('should extract single match pattern', () => {
            const script = `
                // @match https://*.example.com/*
                console.log('test');
            `;
            expect(extractMatchPatterns(script)).toEqual(['https://*.example.com/*']);
        });

        it('should extract multiple match patterns', () => {
            const script = `
                // @match https://*.example.com/*
                // @match http://specific.site.com/path/*
                console.log('test');
            `;
            expect(extractMatchPatterns(script)).toEqual([
                'https://*.example.com/*',
                'http://specific.site.com/path/*'
            ]);
        });

        it('should default to all URLs if no match found', () => {
            const script = `console.log('test');`;
            expect(extractMatchPatterns(script)).toEqual(['*://*/*']);
        });

        it('should extract match from metadata block', () => {
            const script = `
                // ==UserScript==
                // @name Test Script
                // @match https://*.example.com/*
                // ==UserScript==
                console.log('test');
            `;
            expect(extractMatchPatterns(script)).toEqual(['https://*.example.com/*']);
        });
    });

    describe('extractRunAt', () => {
        it('should extract run-at from single line comment', () => {
            const script = `
                // @run-at document_start
                console.log('test');
            `;
            expect(extractRunAt(script)).toBe('document_start');
        });

        it('should extract run-at from metadata block', () => {
            const script = `
                // ==UserScript==
                // @name Test Script
                // @run-at document_end
                // ==UserScript==
                console.log('test');
            `;
            expect(extractRunAt(script)).toBe('document_end');
        });

        it('should default to document_idle if no run-at found', () => {
            const script = `console.log('test');`;
            expect(extractRunAt(script)).toBe('document_idle');
        });

        it('should default to document_idle for invalid run-at value', () => {
            const script = `
                // @run-at invalid_value
                console.log('test');
            `;
            expect(extractRunAt(script)).toBe('document_idle');
        });

        it('should handle all valid run-at values', () => {
            const values = ['document_start', 'document_end', 'document_idle'];
            values.forEach(value => {
                const script = `// @run-at ${value}`;
                expect(extractRunAt(script)).toBe(value);
            });
        });
    });
});