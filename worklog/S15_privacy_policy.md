# Story: Add Privacy Policy

## User Requirement
Add a privacy policy file to document how the extension handles user data and privacy.

## Analysis
Based on the codebase review, the extension handles following types of data:
1. User Scripts
   - Stored locally using chrome.storage.local
   - Contains user-written JavaScript code
   - Includes script metadata (name, match patterns)

2. LLM Settings
   - Stored in chrome.storage.sync
   - Contains API key and base URL
   - Used for AI-powered script generation

3. Page Context
   - Collected temporarily for script generation
   - Includes URL, title, and selected HTML
   - Not persisted, only used during script generation

4. Tab Information
   - Used to track active scripts per tab
   - Includes tab URL and script count
   - Stored temporarily in memory

## Design
Create a comprehensive privacy policy that covers:
1. Data Collection and Usage
2. Data Storage and Security
3. Third-party Services
4. User Rights and Controls
5. Contact Information

## Tasks
[X] Task 1: Create privacy policy document
    - Create PRIVACY.md in project root
    - Document all data handling practices
    - Include user rights and controls
    - Add contact information

[X] Task 2: Add privacy policy link
    - Add link in options page
    - Add link in extension popup
    - Update README.md to reference privacy policy