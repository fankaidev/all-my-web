# S07 Script Pause Functionality

## Feature Requirement
Add ability to pause scripts. A paused script should not be loaded or executed when the extension starts.

## System Design
1. Add `isPaused` flag to Script interface
2. Update script management UI to show pause/resume button
3. Update script registration logic to skip paused scripts
4. Persist pause state in storage

## Implementation Details
1. Added `isPaused` field to Script interface in both panel and background worker
2. Updated script loading to ensure all scripts have `isPaused` field with default value `false`
3. Added `togglePause` function to handle pause/resume actions
4. Updated UI to show pause/resume button and visual indicators for paused scripts
5. Modified script registration to skip paused scripts

## Tasks
[X] Task 1: Update Script interface and storage
- Added `isPaused` field to Script interface
- Updated storage operations to handle the new field
- Migrate existing scripts to include `isPaused` field

[X] Task 2: Update UI components
- Added pause/resume button in ScriptList
- Updated button states based on script status
- Added visual indicator for paused scripts

[X] Task 3: Update script registration
- Skip registration of paused scripts
- Handle pause/resume during runtime

## Changes Made
1. Updated `src/pages/panel/ScriptManager.tsx` to add `isPaused` field to Script interface
2. Modified `src/pages/panel/useScripts.ts` to add `togglePause` function and handle `isPaused` field
3. Updated `src/pages/panel/ScriptList.tsx` to show pause/resume button and visual indicators
4. Modified `src/pages/panel/Panel.tsx` to pass `togglePause` function
5. Updated `src/pages/background/index.ts` to skip paused scripts during registration