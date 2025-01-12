# Add @run-at Directive Support

## Requirements
- Support @run-at directive in userscripts to control script execution timing
- Support standard @run-at values:
  - document_start: Execute script before document loads
  - document_end: Execute script after document loads
  - document_idle: Execute script when page is idle (default)
- Extract @run-at directive from script metadata block
- Default to 'document_idle' if no @run-at is specified
- Update script registration to use the specified timing

## System Design

### Script Processing
1. Add function to extract @run-at directive from script content
2. Support standard @run-at values in metadata block
3. Validate @run-at values against allowed options
4. Default to 'document_idle' if not specified or invalid

### Component Changes
1. Script Parser Utility
   - Add function to parse @run-at directive
   - Add validation for @run-at values
   - Add tests for @run-at parsing

2. Background Service
   - Update script registration to use extracted @run-at value
   - Pass timing to userScripts.register() API

### Test Plan
1. Script Processing
   - Parse scripts with @run-at directive
   - Handle scripts without @run-at
   - Validate @run-at values
   - Test default behavior

2. Script Execution
   - Verify script runs at correct timing
   - Test all @run-at values:
     - document_start
     - document_end
     - document_idle
   - Test invalid @run-at values
   - Test default timing

## Tasks
[X] Task 1: Implement @run-at parsing
    - Add utility function to extract @run-at from script content
    - Add value validation
    - Write tests for parser

[X] Task 2: Update script registration
    - Update background service to use @run-at value
    - Pass timing to userScripts.register()
    - Test script registration with different timings

[X] Task 3: Update documentation
    - Update README with @run-at directive usage
    - Add examples of different timing values
    - Document default behavior

[X] Task 4: Add integration tests
    - Add test scripts with different @run-at values
    - Test script registration with timing
    - Verify script execution order
    - Test script timing in real page load