# All My Web

The single browser extention to manage all my web!

All My Web is a browser extension that helps you manage and automate your web browsing experience through custom JavaScript scripts.

Just describe what you want to do with any website, and the extension will generate the script for you.

For example, you can change the background color of the page, or add a new button to the page, or generate summary of the page content, without writing any code.

You have full control of the script, and can further edit it in case you need to.


## Credit

The idea of userscripts is inspired by [tampermonkey](https://www.tampermonkey.net/) and [violentmonkey](https://violentmonkey.github.io/). Hopefully this extension could be fully compatible with userscripts in the future.

This project is largely built by AI coding agents, notably with [cursor](https://cursor.dev/) and [cline](https://github.com/cline/cline), powered by [Claude 3.5 Sonnet](https://www.anthropic.com/claude/sonnet) and [Deepseek V3](https://www.deepseek.com). Refer to [.rules](.rules) for more details in the cooperation process with coding agents.

The chrome extension code structure is bootstrapped by [vite-web-extension](https://github.com/JohnBra/vite-web-extension).

## Features

- [x] Load and inject user scripts into the page
- [x] Basic Script Management
- [x] LLM-powered Script Editor
- [x] Basic compatibility with user scripts
- [ ] Chatbot style script editor
- [ ] Better compatibility with user scripts

## Userscript Compatibility

The extension supports following userscript directives in script comments:

### Metadata Block
```javascript
// ==UserScript==
// @name        My Script
// @match       https://*.example.com/*
// @match       http://specific.site.com/path/*
// @run-at      document_start
// ==UserScript==
```

### Supported Directives
- `@match` - Control which pages the script runs on
  - Supports Chrome's match pattern syntax
  - Multiple patterns allowed
  - Default: "*://*/*" (all pages)
  - Examples:
    - `*://*/*` - any URL
    - `https://*.example.com/*` - all subdomains
    - `http://specific.site.com/path/*` - specific path

- `@run-at` - Control script execution timing
  - `document_start` - Execute before document loads
  - `document_end` - Execute after document loads
  - `document_idle` - Execute when page is idle (default)

### Coming Soon
- `@include` - Regex-based URL matching
- `@exclude` - URL exclusion patterns
- `@description` - Script description
- `@version` - Script version
- `@grant` - API permissions
- `@require` - External dependencies

## Privacy

We take your privacy seriously. Please read our [Privacy Policy](PRIVACY.md) to understand how we handle your data.


## Contributing

Suggestions and contributions are welcome!