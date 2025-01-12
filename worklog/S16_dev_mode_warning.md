# Developer Mode Warning Message

## Requirement
Display a warning message in the sidebar when Chrome's developer mode is not enabled, as this is required for user script functionality.

## Design
1. Create a reusable warning component for displaying error states
2. Add developer mode check in background script (already exists)
3. Check developer mode status directly in panel
   - Check on mount
   - Poll every 2 seconds when disabled
   - Stop polling when enabled
4. Display warning in panel when developer mode is disabled

## Tasks
[X] Task 1: Create warning message component
- Create a new Warning component in shared components
- Style with TailwindCSS for consistent look
- Support different warning types (error, warning, info)

[X] Task 2: Implement developer mode status check
- Add developer mode status to store
- Check status on panel mount
- Poll status when disabled
- Stop polling when enabled

[X] Task 3: Display warning in panel
- Add warning component to panel
- Subscribe to developer mode status
- Show warning when disabled with instructions

## Test Plan
1. Unit Tests
- Test Warning component rendering
- Test developer mode status store
- Test background script status check

2. Integration Tests
- Verify warning shows/hides based on developer mode
- Check polling works correctly

3. Manual Tests
- Test with developer mode enabled/disabled
- Verify warning message is clear and helpful
- Check styling in different themes
- Verify warning disappears automatically when dev mode enabled