# All My Web

The single browser extention to manage all my web!

## Features

[X] Load and inject user scripts into the page
[X] Basic Script Management
[X] LLM-powered Script Editor
[X] Compatibility with user scripts

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

## Credit

This project is bootstrapped by [vite-web-extension](https://github.com/JohnBra/vite-web-extension).

## Change Log