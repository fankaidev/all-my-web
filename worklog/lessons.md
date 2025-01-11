# Lessons

## Logging Practices
1. Always add abundant debug logs to help troubleshooting
2. All log messages should start with '[amw]:' (project prefix) for easy filtering
3. Logs should be informative and indicate the context/component where they're from
4. Use appropriate console methods:
   - `console.debug` for detailed debugging information (most cases)
   - `console.log` for important information or state changes
   - `console.error` for errors and failures
   - `console.warn` for warnings and potential issues

### Examples
```typescript
// Good
console.debug('[amw]: loading saved script from storage...');
console.debug('[amw]: attempting to parse configuration...');
console.log('[amw]: script saved and activated successfully');
console.error('[amw]: failed to execute script:', error);

// Bad
console.log('loaded');  // Use console.debug and add prefix
console.log('saving...'); // Add more context
console.log('error:', error); // Use console.error for errors
```

