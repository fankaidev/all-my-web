# Privacy Policy for All My Web Extension

## Introduction
All My Web is a browser extension that helps users manage and automate their web browsing experience through user scripts. We take your privacy seriously and want to be transparent about how we handle your data.

We DO NOT collect any data unless you explicitly opt to use the free generation feature.

## Data Storage and Usage

### 1. User Scripts
- **What it is**: JavaScript code and metadata (name, match patterns) that you create or edit
- **How it works**: Your scripts are executed on matching web pages
- **Where it's stored**: In chrome.storage.sync (synced across your browser instances)
- **Retention**: Until you delete the scripts or uninstall the extension
- **Sharing**: Scripts remain in your browser and are not transmitted to our servers

### 2. Your Own LLM Settings
- **What it is**: Your own LLM API key and base URL
- **How it works**: You can use your own LLM API key and base URL to generate scripts
- **Where it's stored**: In chrome.storage.sync (synced across your browser instances)
- **Retention**: Until you delete the scripts or uninstall the extension
- **Sharing**: Your LLM settings remain in your browser and are not transmitted to our servers

### 3. Page Context and Script Requirements
- **What we collect**: Current page URL, title, selected HTML content, and script requirements
- **How we use it**: Temporarily for AI-powered script generation
- **Where it's stored**: Only in memory during script generation
- **Retention**: Deleted immediately after script generation
- **Sharing**: If you set up your own LLM, your page context and script requirements will be sent to your LLM server only, and are not transmitted to our servers.

## Data Collection
We only collect data when you use the free generation feature, which includes:
- Login credentials for authentication
- Script requirements and page context for script generation

If you don't use the free generation feature, no data is collected or transmitted to our servers.

## Data Security
If you set up your own LLM
- All data is stored locally in your browser
- No data is sent to our servers
- Script requirements and page context are sent to your LLM server

If you choose to use our free generation feature
- Communication with All My Web server uses secure HTTPS connections
- Script requirements and page context might be recorded for service improvement purposes, and will not be shared with third parties


## User Rights and Controls
You have full control over your data:
1. View all stored scripts in the extension interface
2. Edit or delete any script at any time
3. Pause script execution without deleting
4. Clear all data by uninstalling the extension

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