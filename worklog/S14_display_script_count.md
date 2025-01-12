# Display Script Count in Extension Icon and Sidebar

## Requirement
Display the number of registered scripts for the current web page in:
1. Extension icon badge
2. Mark applicable scripts in sidebar with a tag

## Design
We need to:
1. Track active scripts for each tab (for badge)
2. Update badge text when scripts change
3. Clear badge when navigating to pages with no scripts
4. Add "Active" tag for scripts that match current URL
5. Update script list when URL changes

### Components
- Background service: Track script count per tab and update badge
- Badge API: Use chrome.action.setBadgeText/setBadgeBackgroundColor
- Panel UI: Display "Active" tag for applicable scripts
- URL matching: Check if script matches current URL

### Data Flow
1. When scripts are registered/unregistered for a tab:
   - Update script count in background service
   - Update badge text for that tab
2. When tab changes/updates:
   - Get script count for new tab
   - Update badge accordingly
3. In sidebar panel:
   - Get current tab's URL
   - Check each script's match patterns against URL
   - Show "Active" tag for matching scripts

## Tasks
[X] Task 1: Implement script counting in background service
    - Added tabScriptCounts Map to track scripts per tab
    - Update count on script registration/unregistration
    - Clear count when tab closes
    - Added unit tests for script counting
    - Added badge text updates with green background

[X] Task 2: Add badge management
    - Implemented badge text updates with updateBadge function
    - Set badge style to green background
    - Handle tab changes in onUpdated listener

[X] Task 3: Add active script indicators in sidebar
    - Added getCurrentTab utility function
    - Added URL pattern matching in ScriptList
    - Added "Active" tag with green background
    - Added tab change listeners to update tags
    - Added comprehensive tests for URL matching

## Test Plan
- Unit tests:
  - Script count tracking ✓
  - Badge text updates ✓
  - Tab change handling ✓
  - URL pattern matching ✓
  - Active tag display ✓
- Manual tests:
  - Verify badge shows correct count
  - Check badge updates when adding/removing scripts
  - Verify badge clears when changing tabs
  - Verify "Active" tags match current URL
  - Check tags update when URL changes

## Implementation Notes
- Used Map to efficiently track script counts per tab
- Badge shows empty text when no scripts are active
- Badge shows green background for better visibility
- Added comprehensive unit tests for all functionality
- Handles script registration, tab updates, and tab removal
- Reused URL matching logic from background service
- Added real-time updates for Active tags when URL changes
- Ensured Active tag is not shown for paused scripts