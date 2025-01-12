# Add Script URL Matching Support

## Requirements
- Support "@match" field in user scripts to control which web pages the script runs on
- Match patterns should follow Chrome extension's match pattern syntax
- Scripts should only execute on web pages that match their patterns
- Default to "*://*/*" if no @match is found in script body
- Support "@include" and "@exclude" directives for more flexible URL matching

## System Design

### Script Processing
- Extract @match directives from script body during script registration
- Support multiple @match lines in script comments
- Default to "*://*/*" if no @match directive found
- Support @include for regex-based URL matching
- Support @exclude to prevent script execution on certain URLs
- No changes needed to Script type or storage

### Component Changes
1. Script Processing Utility
   - Add function to parse @match directives from script content
   - Handle multiple @match patterns
   - Validate match patterns
   - Add support for @include regex patterns
   - Add support for @exclude patterns

2. Background Service
   - Extract and cache match patterns when registering scripts
   - Only execute scripts whose patterns match the current page URL
   - Handle @include/@exclude patterns in addition to @match

### Test Plan
1. Script Processing
   - Parse scripts with single @match
   - Parse scripts with multiple @match
   - Handle scripts without @match
   - Verify pattern validation
   - Test @include regex patterns
   - Test @exclude patterns
   - Test combination of @match, @include, and @exclude

2. Script Execution
   - Verify script runs on matching URLs
   - Verify script doesn't run on non-matching URLs
   - Test various pattern formats:
     - "*://*/*"
     - "https://*.example.com/*"
     - "http://specific.site.com/path/*"
   - Test regex patterns from @include
   - Test URL exclusion with @exclude
   - Test priority between different directives

## Tasks
[X] Task 1: Implement match pattern parsing
    - Add utility function to extract @match from script content
    - Add pattern validation
    - Write tests for parser

[X] Task 2: Update script execution logic
    - Cache extracted patterns during script registration
    - Add URL matching check in background service
    - Only execute scripts on matching pages

[ ] Task 3: Documentation
    - Update README with @match directive usage
    - Add examples of common patterns

[ ] Task 4: Support @include and @exclude
    - Add regex pattern support for @include
    - Add URL exclusion with @exclude
    - Handle priority between directives
    - Update script registration to use all patterns