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

## Storage Practices
1. User scripts are stored in Chrome's sync storage:
   - Key: 'userScript'
   - Using `chrome.storage.sync` for cross-device synchronization
   - Loaded when panel opens
   - Saved when "Save" is clicked
2. Benefits of sync storage:
   - Automatically syncs across user's devices
   - Persists across browser restarts
   - No size limit concerns for script storage

## Script Execution
1. Scripts are executed through content script:
   - Content script loads automatically on each page
   - Reads script from storage and executes it
   - No need for manual script injection
   - Avoids CSP issues with extension context
2. Example of content script execution:
```typescript
chrome.storage.sync.get(['userScript'], (result) => {
  if (result.userScript) {
    try {
      // Remove metadata block if exists
      const cleanScript = result.userScript.replace(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/m, '');
      // Execute the script
      eval(cleanScript);
    } catch (error) {
      console.error('[amw] error executing user script:', error);
    }
  }
});
```
3. Important considerations:
   - Content script runs in isolated world
   - Clean up userscript metadata before execution
   - Handle errors appropriately
   - Scripts are automatically executed on page load

## Script Format
1. All scripts should follow the userscript metadata format:
```javascript
// ==UserScript==
// @name         Script Name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script description
// @author       Author name
// @match        *://*/*
// @grant        none
// ==/UserScript==
```
2. Common metadata fields:
   - @name: Name of the script
   - @namespace: Usually your domain or tampermonkey.net
   - @version: Script version
   - @description: What the script does
   - @author: Who wrote it
   - @match: Which URLs it runs on (e.g., *://*/*, https://*.google.com/*)
   - @grant: Required permissions (none if no special permissions needed)

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