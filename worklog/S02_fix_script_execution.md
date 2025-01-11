# Fix User Script Execution in MV3

## Background
Current implementation tries to use `eval()` to execute user scripts, which is blocked by Chrome's Content Security Policy (CSP) in Manifest V3. We need to use the official `chrome.userScripts` API to execute user scripts securely.

## Analysis
1. In Manifest V3, Chrome provides dedicated `chrome.userScripts` API for executing user scripts
2. The API requires:
   - `userScripts` permission in manifest
   - User must enable Developer Mode in chrome://extensions
   - Scripts can run in isolated world (`USER_SCRIPT`) or main world (`MAIN`)
3. Scripts are cleared when extension updates, need to re-register in `runtime.onInstalled`

## Design
1. Add `userScripts` permission to manifest.json
2. Configure user script world with proper CSP and messaging
3. Register user scripts using `chrome.userScripts.register()`
4. Re-register scripts on extension update via `runtime.onInstalled`

## Tasks
[X] Task 1: Setup userScripts API
- Add userScripts permission to manifest.json
- Configure user script world with CSP
- Add script registration in background worker
- Handle extension updates

[X] Task 2: Add error handling and user feedback
- Add proper error handling for script registration
- Add developer mode check
- Add user feedback for registration status
- Implement logging system for debugging

## Test Plan

### Test Script
```javascript
// ==UserScript==
// @name         AMW Test Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Test script for All My Web
// @author       AMW
// @match        *://*/*
// @grant        none
// ==/UserScript==

// Add a test element to verify script execution
const testDiv = document.createElement('div');
testDiv.id = 'amw-test-script';
testDiv.style.cssText = `
    position: fixed;
    bottom: 16px;
    right: 16px;
    padding: 12px;
    background: #3b82f6;
    color: white;
    font-family: system-ui;
    border-radius: 4px;
    z-index: 999999;
`;
testDiv.textContent = 'AMW Test Script Running';
document.body.appendChild(testDiv);

// Add a counter to test script persistence
let counter = 0;
setInterval(() => {
    counter++;
    testDiv.textContent = `AMW Test Script Running (${counter}s)`;
}, 1000);

// Log to verify execution
console.log('[amw-test] script executed successfully');
```

### Test Cases

#### 1. Basic Script Execution
1. Enable Developer Mode in chrome://extensions
2. Load the extension
3. Open any webpage (e.g. https://example.com)
4. Open side panel
5. Copy test script into script editor
6. Save the script
7. Expected Results:
   - Success notification should appear
   - Blue box should appear at bottom right
   - Counter should start incrementing
   - Console should show success log

#### 2. Script with Metadata Block
1. Verify that metadata block is properly handled
2. Expected Results:
   - Script should execute without errors
   - Metadata block should not interfere with execution

#### 3. Error Handling
1. Disable Developer Mode in chrome://extensions
2. Try to save script
3. Expected Results:
   - Error notification about Developer Mode
   - Script should not execute
4. Re-enable Developer Mode
5. Try to save invalid script (e.g. with syntax error)
6. Expected Results:
   - Error notification about script error
   - Previous script should continue running

#### 4. Script Execution on Different Pages
1. Navigate to different pages:
   - http://example.com
   - https://github.com
   - chrome://extensions
2. Expected Results:
   - Script should execute on regular pages
   - Script should not execute on chrome:// pages
   - Counter should reset on page navigation

#### 5. Script Persistence
1. Save script and verify execution
2. Reload page
3. Expected Results:
   - Script should auto-execute after reload
   - Counter should start from 0
4. Close and reopen browser
5. Expected Results:
   - Script should auto-execute on browser restart
   - Counter should start from 0

#### 6. Developer Mode Behavior
1. Start with Developer Mode enabled
2. Save and verify script
3. Disable Developer Mode
4. Expected Results:
   - Existing script should continue running
   - Cannot save new scripts
5. Re-enable Developer Mode
6. Expected Results:
   - Can save new scripts again

### Test Results
[ ] Test 1: Basic Script Execution
[ ] Test 2: Script with Metadata Block
[ ] Test 3: Error Handling
[ ] Test 4: Script Execution on Different Pages
[ ] Test 5: Script Persistence
[ ] Test 6: Developer Mode Behavior