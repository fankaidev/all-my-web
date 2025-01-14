# All My Web 🌐

The single browser extension to manage all your web browsing experience!

All My Web is a browser extension that empowers you to customize and automate your web browsing through smart JavaScript scripts - no coding required!

Simply describe what you want to do with any website, and let the AI generate the perfect script for you.
You can easily manage all the scripts, and could pauseor resume any script as you want.

Examples of what you can do:
- 🎨 Change website appearance and styles
- 🔧 Add custom buttons and features
- 📝 Generate content summaries
- ⚡ Automate repetitive tasks

You always have full control - view, edit, or customize any script to match your exact needs!

Now start to make the web all yours!

## Demo

Watch how All My Web works:

[![All My Web Demo](https://img.youtube.com/vi/auxHmExLvpA/0.jpg)](https://www.youtube.com/watch?v=auxHmExLvpA)

## Credit

- Apparently the idea is inspired and highly influenced by userscipts and all the exceptional tools including [tampermonkey](https://www.tampermonkey.net/) and [violentmonkey](https://violentmonkey.github.io/).
- Built with AI assistance from [cursor](https://cursor.dev/) and [cline](https://github.com/cline/cline), powered by [Claude 3.5 Sonnet](https://www.anthropic.com/claude/sonnet) and [Deepseek V3](https://www.deepseek.com)
- Extension structure based on [vite-web-extension](https://github.com/JohnBra/vite-web-extension)

## Features ✨

- ✅ Load and inject user scripts into pages
- ✅ Smart script management
- ✅ AI-powered script editor
- ✅ Basic userscript compatibility
- 🚧 Chatbot-style script editor (Coming soon)
- 🚧 Enhanced userscript compatibility (Coming soon)

## Userscript Compatibility

The extension supports these userscript directives in script comments:

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

#### @match - URL Pattern Matching
- Supports Chrome's match pattern syntax
- Multiple patterns allowed
- Default: "*://*/*" (all pages)
Examples:
- `*://*/*` - any URL
- `https://*.example.com/*` - all subdomains
- `http://specific.site.com/path/*` - specific path

#### @run-at - Execution Timing
- `document_start` - Before document loads
- `document_end` - After document loads
- `document_idle` - When page is idle (default)

### Coming Soon
- `@include` - Regex-based URL matching
- `@exclude` - URL exclusion patterns
- `@description` - Script description
- `@version` - Script version
- `@grant` - API permissions
- `@require` - External dependencies

## Privacy

We DO NOT collect any data from you.
Please read our [Privacy Policy](PRIVACY.md) to understand how we handle your data.

## Contributing

Suggestions and contributions are welcome!