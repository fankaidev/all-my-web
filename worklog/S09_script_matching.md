# Add Script URL Matching Support

## Requirements
- Support "@match" field in user scripts to control which web pages the script runs on
- Match patterns should follow Chrome extension's match pattern syntax
- Scripts should only execute on web pages that match their patterns
- Default to "*://*/*" if no @match is found in script body

## System Design

### Script Processing
- Extract @match directives from script body during script registration
- Support multiple @match lines in script comments
- Default to "*://*/*" if no @match directive found
- No changes needed to Script type or storage

### Component Changes
1. Script Processing Utility
   - Add function to parse @match directives from script content
   - Handle multiple @match patterns
   - Validate match patterns

2. Background Service
   - Extract and cache match patterns when registering scripts
   - Only execute scripts whose patterns match the current page URL

### Test Plan
1. Script Processing
   - Parse scripts with single @match
   - Parse scripts with multiple @match
   - Handle scripts without @match
   - Verify pattern validation

2. Script Execution
   - Verify script runs on matching URLs
   - Verify script doesn't run on non-matching URLs
   - Test various pattern formats:
     - "*://*/*"
     - "https://*.example.com/*"
     - "http://specific.site.com/path/*"

## Tasks
[X] Task 1: Implement match pattern parsing
    - Add utility function to extract @match from script content
    - Add pattern validation
    - Write tests for parser

[ ] Task 2: Update script execution logic
    - Cache extracted patterns during script registration
    - Add URL matching check in background service
    - Only execute scripts on matching pages

[ ] Task 3: Documentation
    - Update README with @match directive usage
    - Add examples of common patterns