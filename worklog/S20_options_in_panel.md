# Story: Refactor Options Page into Panel

## Requirements
* Remove system options page entry
* Add options page under panel UI
* Add settings icon in panel's top-right corner to access options
* Move all options functionality from standalone page to panel

## Design
### Architecture Changes
* Remove options page from manifest.json
* Create new options component under panel
* Add navigation between panel main view and options view
* Move options state management to panel context

### UI Design
* Add settings icon button in panel header
* Options view should maintain same styling as current panel
* Ensure smooth transition between views

## Tasks
[X] Task 1: Remove options page entry
- Remove options entry from manifest.json
- Clean up standalone options page files
- Update build configuration

[X] Task 2: Create options component in panel
- Create new OptionsView component
- Move existing options functionality to new component
- Add settings icon and click handler
- Implement view switching logic

[X] Task 3: Clean up old options files
- Remove src/pages/options directory
- Remove options-related test files
- Update build configuration if needed

[ ] Task 4: Add new tests
- Add tests for OptionsView component
  * Test rendering
  * Test form interactions
  * Test save functionality
  * Test close functionality
- Add tests for LLM store
  * Test settings persistence
  * Test settings update
- Add tests for Panel with options
  * Test options toggle
  * Test integration with OptionsView

## Test Plan
* Verify all options functionality works in panel
* Test navigation between panel and options views
* Ensure settings persist correctly
* Verify proper cleanup of old options page
* Test responsive layout in panel