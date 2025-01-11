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

## Chrome Extension Development
1. In Manifest V3, `eval()` and dynamic code execution is blocked by CSP
2. For user script execution, use `chrome.userScripts` API:
   - Requires `userScripts` permission in manifest
   - User must enable Developer Mode in chrome://extensions
   - Scripts can run in isolated world (`USER_SCRIPT`) or main world (`MAIN`)
   - Scripts are cleared when extension updates, need to re-register
3. Example of userScripts API usage:
```typescript
// Configure user script world
await chrome.userScripts.configureWorld({
    csp: "script-src 'self' 'unsafe-eval'",  // Allow eval in user scripts
    messaging: true  // Enable messaging between user scripts and extension
});

// Register user script
await chrome.userScripts.register([{
    id: 'my-script',
    matches: ['<all_urls>'],
    js: [{ code: scriptContent }],
    world: 'USER_SCRIPT'
}]);
```

### Developer Mode
1. Developer Mode is required for userScripts API
2. Check if Developer Mode is enabled:
```typescript
async function isDeveloperModeEnabled(): Promise<boolean> {
    try {
        // Property access which throws if developer mode is not enabled
        chrome.userScripts;
        return true;
    } catch {
        return false;
    }
}
```
3. Always check before script operations:
```typescript
if (!await isDeveloperModeEnabled()) {
    throw new Error('Developer mode must be enabled in chrome://extensions');
}
```