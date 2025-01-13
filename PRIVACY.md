# Privacy Policy for All My Web Extension

## Introduction
All My Web is a browser extension that helps users manage and automate their web browsing experience through user scripts. We take your privacy seriously and want to be transparent about what data we collect and how we use it.

Please note this extension full works inside your browser, and does not communicate with our server at all.
All your data collected as listed below will be stored locally in your browser, and will not be shared with any third parties.

## Data Collection and Usage

### 1. User Scripts
- **What we collect**: JavaScript code and metadata (name, match patterns) that you create or edit
- **How we use it**: To execute your scripts on matching web pages
- **Where it's stored**: Locally on your device using chrome.storage.local
- **Retention**: Until you delete the scripts or uninstall the extension
- **Sharing**: Scripts are never transmitted to our servers or shared with third parties

### 2. LLM Settings
- **What we collect**: API key and base URL for AI services
- **How we use it**: To provide AI-powered script generation features
- **Where it's stored**: In chrome.storage.sync (synced across your browser instances)
- **Security**: API keys are stored securely and only transmitted to the specified API endpoint
- **Sharing**: Never shared with third parties or our servers

### 3. Page Context
- **What we collect**: Current page URL, title, and selected HTML content
- **How we use it**: Temporarily for AI-powered script generation
- **Where it's stored**: Only in memory during script generation
- **Retention**: Deleted immediately after script generation
- **Sharing**: Only shared with the AI service you configure when using script generation

### 4. Tab Information
- **What we collect**: Tab URLs and active script counts
- **How we use it**: To track which scripts are active on each tab
- **Where it's stored**: Temporarily in memory
- **Retention**: Cleared when tabs are closed
- **Sharing**: Never shared outside your browser

## Third-party Services

### AI Services
- You can configure the extension to use OpenAI-compatible AI services
- We only send data to the API endpoint you specify
- The handling of data by these services is governed by their respective privacy policies
- You can disable AI features by not providing API credentials

## Data Security
- All data is stored locally in your browser
- API keys are stored securely using chrome.storage.sync
- No data is sent to our servers
- Communication with AI services uses secure HTTPS connections

## User Rights and Controls
You have full control over your data:
1. View all stored scripts in the extension interface
2. Edit or delete any script at any time
3. Pause script execution without deleting
4. Clear all data by uninstalling the extension
5. Control AI feature usage through API settings

## Browser Permissions
The extension requires these permissions:
- `activeTab`: To interact with the current tab
- `sidePanel`: To show the extension interface
- `userScripts`: To execute your scripts
- `storage`: To save your scripts and settings
- `tabs`: To track script execution
- `windows`: To manage the extension panel
- `scripting`: To collect page context for AI features

## Updates to Privacy Policy
We will update this privacy policy as needed to reflect changes in our practices or functionality. Significant changes will be communicated through the extension's update notes.

## Contact Information
For privacy-related questions or concerns:
- GitHub Issues: [https://github.com/fankaidev/all-my-web/issues](https://github.com/fankaidev/all-my-web/issues)
- Email: [fankaidev@gmail.com](mailto:fankaidev@gmail.com)

## Effective Date
This privacy policy is effective as of [Current Date].