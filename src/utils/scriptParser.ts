/**
 * Extract @match directives from script content
 * @param scriptBody The content of the user script
 * @returns Array of match patterns, defaults to ["*:\/\/*\/*"] if no @match found
    */
export function extractMatchPatterns(scriptBody: string): string[] {
    // Match @match directives in comments
    const matchRegex = /\/\/\s*@match\s+(.+)|\/\*[\s\S]*?@match\s+(.+?)[\s\*][\s\S]*?\*\//g;
    const matches: string[] = [];

    let match;
    while ((match = matchRegex.exec(scriptBody)) !== null) {
        // match[1] is for single-line comments, match[2] is for multi-line comments
        const pattern = match[1] || match[2];
        if (pattern && isValidMatchPattern(pattern.trim())) {
            matches.push(pattern.trim());
        }
    }

    // Default to all URLs if no valid matches found
    return matches.length > 0 ? matches : ["*://*/*"];
}

/**
 * Validate a match pattern following Chrome's match pattern syntax
 * @see https://developer.chrome.com/docs/extensions/mv3/match_patterns/
 */
export function isValidMatchPattern(pattern: string): boolean {
    if (pattern === "<all_urls>") return true;

    // Special case: "*://*/*" is valid
    if (pattern === "*://*/*") return true;

    // Regular match pattern: <scheme>://<host>[:<port>]/<path>
    const schemeSegment = "\\*|https?|file|ftp|wss?";
    const hostSegment = "\\*|(?:\\*\\.)?(?:[^/*:]+)(?::\\d+)?";
    const pathSegment = "[^\\s]*";

    const matchPatternRegex = new RegExp(
        `^(${schemeSegment})://(${hostSegment})(/${pathSegment})$`
    );

    return matchPatternRegex.test(pattern);
}