# Add LLM Settings Warning in Script Editor

## Requirements
- Show warning message in script editor when LLM settings are not properly configured
- Provide clear instructions on how to set up LLM settings
- Warning should be visible but not block the editor functionality
- Should check both API key and model selection

## Design
We will:
1. Add a check for LLM settings in the script editor component
2. Create a reusable Warning component for displaying the message
3. Add instructions for setting up LLM in the warning message

## Tasks
[X] Task 1: Add LLM settings check and warning message
- Add LLM settings check in ScriptEditor component
- Use Warning component to display message
- Add clear instructions for setup
- Style warning to be noticeable but not intrusive
- Disable Generate button when LLM is not configured

## Implementation Notes
- Will reuse existing Warning component from developer mode warning
- Will need to access LLM settings from options store
- Warning should be displayed at the top of the editor
- Should provide direct link to options page for easy setup

## Status
✅ All tasks completed. The LLM settings warning is now functional with:
- Warning message when LLM settings are not configured
- Clear instructions for setting up LLM
- Generate button disabled when LLM is not configured
- Reused Warning component for consistent UI