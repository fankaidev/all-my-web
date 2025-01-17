# Enhance Script Generation with Page Context

## Requirement
Enhance the script generation by providing more contextual information to the LLM:
- Current URL
- Page title
- Selected HTML content

## Design

### Context Collection
We need to collect the following information from the active tab:
1. URL - using `chrome.tabs.query` to get current tab URL
2. Page content - using content script to extract:
   - Document title
   - Selected HTML (if any text is selected)

### Data Flow
1. When user requests script generation:
   - Panel UI requests context from background script
   - Background script injects script to collect data
   - Script extracts URL, title, and selected HTML
   - Background script forwards context to panel
   - Panel includes context in LLM prompt

### Prompt Enhancement
Update the script generation prompt to:
1. Include page context section with URL, title, and selected HTML
2. Guide LLM to use context for better targeting
3. Ensure generated scripts are specific to the current page and selected elements

## Implementation Details

### Context Collection
Created following files:
1. `src/utils/pageContext.ts`
   - Defines `PageContext` interface with url, title, and selectionHtml
   - Type definitions for context data structure

2. Updated `src/pages/background/index.ts`
   - Added message handler for `GET_PAGE_CONTEXT` requests
   - Uses script injection to collect page data
   - Extracts selected HTML using DOM APIs
   - Forwards context to panel

3. Updated `src/pages/panel/ScriptEditor.tsx`
   - Added `getPageContext()` function to request context from background
   - Uses message passing to get context from active tab
   - Handles error cases properly

4. Updated `src/utils/prompts.ts`
   - Added context section to prompt template
   - Updated examples to demonstrate context usage including selected HTML
   - Added placeholders for dynamic context insertion

### Fixed Issues
- Fixed context collection to get data from active tab instead of extension context
- Implemented proper message passing between panel, background, and content scripts
- Added error handling for context collection failures
- Added "scripting" permission to manifest for content script injection
- Changed script injection to use inline function instead of file path
- Added selection HTML extraction with proper error handling

## Tasks
[X] Task 1: Add context collection content script
    - Created simplified pageContext utilities
    - Implemented message handling
    - Added context collector content script

[X] Task 2: Update background script
    - Add context collection request handler
    - Setup message forwarding between content and panel

[X] Task 3: Enhance prompt template
    - Update prompt to include context section
    - Add examples using context
    - Update prompt in ScriptEditor component

[ ] Task 4: Add tests
    - Test context collection functions
    - Test message handling
    - Test prompt generation with context

[X] Task 5: Add selected HTML to context
    - Updated PageContext interface to include selectedHtml
    - Modified script injection to get selection HTML
    - Updated prompt template with selection examples
    - Added error handling for invalid HTML