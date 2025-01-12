# Display Script Count in Extension Icon and Sidebar

## Requirement
Display the number of registered scripts for the current web page in:
1. Extension icon badge
2. Sidebar panel header

## Design
We need to:
1. Track active scripts for each tab
2. Update badge text when scripts change
3. Clear badge when navigating to pages with no scripts
4. Add script count to sidebar panel header
5. Keep sidebar count in sync with badge

### Components
- Background service: Track script count per tab and update badge
- Badge API: Use chrome.action.setBadgeText/setBadgeBackgroundColor
- Panel UI: Display script count in header
- Message passing: Keep sidebar count in sync with background

### Data Flow
1. When scripts are registered/unregistered for a tab:
   - Update script count in background service
   - Update badge text for that tab
   - Send message to panel to update count
2. When tab changes/updates:
   - Get script count for new tab
   - Update badge accordingly
   - Send message to panel to update count
3. When panel opens:
   - Query background for current tab's script count
   - Update panel header with count

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

[ ] Task 3: Add script count to sidebar
    - Add count display in panel header
    - Add message handler for count updates
    - Add message sending in background service
    - Update panel when it opens
    - Add tests for panel count display

## Test Plan
- Unit tests:
  - Script count tracking ✓
  - Badge text updates ✓
  - Tab change handling ✓
  - Panel count display
  - Message passing
- Manual tests:
  - Verify badge shows correct count
  - Check badge updates when adding/removing scripts
  - Verify badge clears when changing tabs
  - Verify sidebar shows same count as badge
  - Check sidebar updates when count changes

## Implementation Notes
- Used Map to efficiently track script counts per tab
- Badge shows empty text when no scripts are active
- Badge shows green background for better visibility
- Added comprehensive unit tests for all functionality
- Handles script registration, tab updates, and tab removal
- Need to add message passing for panel synchronization