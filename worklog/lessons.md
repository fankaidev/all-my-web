# Lessons

## Logging Practices
1. Always add abundant debug logs to help troubleshooting
2. All log messages should start with '[amw]' (project prefix) for easy filtering
3. Logs should be informative and describe the action clearly
4. Use appropriate console methods:
   - `console.debug` for detailed debugging information (most cases)
   - `console.log` for important information or state changes
   - `console.error` for errors and failures
   - `console.warn` for warnings and potential issues

### Examples
```typescript
// Good
console.debug('[amw] loading saved script from storage');
console.debug('[amw] attempting to initialize side panel');
console.log('[amw] script saved and activated');
console.error('[amw] failed to execute script:', error);

// Bad
console.log('loaded');  // Missing prefix
console.log('[amw]: saving...'); // Incorrect format with colon after prefix
console.log('[amw] error:' + error); // Use proper error format with comma
```

