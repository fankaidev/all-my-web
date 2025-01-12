# Story: Refactor Script Editor UI Layout

## Background
The script editor UI needs improvement in button alignment and overall layout consistency.
Currently, the save/cancel buttons are in a different location than the generate button,
which can be confusing for users.

## Requirements
- Align save/cancel/generate buttons in a consistent location
- Improve visual hierarchy of the editor interface
- Maintain existing functionality while improving usability

## Design
The buttons will be moved to a fixed footer area at the bottom of the editor:
- Save and Cancel buttons will be on the right side
- Generate button will be on the left side
- All buttons will have consistent styling and spacing

## Tasks
[X] Task 1: Refactor ScriptEditor component layout
    - Added flex container with full height
    - Created scrollable content area
    - Moved all buttons to fixed footer with border separator
    - Updated button styles for consistency
    - Added text labels for better clarity

[X] Task 2: Improve script body textarea layout
    - Made script body textarea expand to fill available space
    - Fixed flex layout nesting for proper height calculation
    - Added wrapper div with flex-1 and min-h-0
    - Disabled textarea resizing for better control

[X] Task 3: Improve error handling display
    - Added local error state management
    - Moved error message above buttons
    - Enhanced error message styling
    - Added proper error message extraction from errors

[X] Task 4: Add page URL display
    - Added URL state management
    - Display URL below script name
    - Added truncation for long URLs
    - Used muted color for better visual hierarchy

## Test Plan
- Verify all buttons are properly aligned
- Ensure all button actions work as before
- Check responsive behavior on different screen sizes
- Verify visual consistency with the rest of the UI
- Verify error messages are displayed correctly
- Verify URL is displayed and truncated properly

## Implementation Details
- Used flex layout with `flex-col` and `h-full` for proper content organization
- Added `flex-1` and `min-h-0` at each flex level for proper height calculation
- Created footer area with `border-t` and consistent padding
- Updated button styles with consistent colors and spacing
- Added text labels alongside icons for better usability
- Used wrapper div with `flex-1` and `min-h-0` for script body textarea
- Set textarea to `h-full` and `resize-none` for proper sizing
- Added error state with useState for better error management
- Enhanced error message display with proper styling and positioning
- Added URL display with truncation and proper spacing