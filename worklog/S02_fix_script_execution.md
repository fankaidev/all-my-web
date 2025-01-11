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
[ ] Task 1: Setup userScripts API
- Add userScripts permission to manifest.json
- Configure user script world with CSP
- Add script registration in background worker
- Handle extension updates

[ ] Task 2: Add error handling and user feedback
- Add proper error handling for script registration
- Add developer mode check
- Add user feedback for registration status
- Implement logging system for debugging

## Test Plan
1. Test basic script execution
2. Test script with metadata block
3. Test error handling
4. Test script execution on different pages
5. Test script persistence across page reloads
6. Test behavior when developer mode is disabled