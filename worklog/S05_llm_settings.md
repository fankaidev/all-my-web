# Story: Add LLM Settings in Options Page

## Requirements
- Add options page for configuring OpenAI-compatible LLM settings
- Settings should include:
  - API Key
  - API Base URL
- Settings should be stored securely
- Settings should be accessible from other parts of the extension

## Design
### UI Components
- Create a form in options page with:
  - Text input for API Key (password type for security)
  - Text input for API Base URL
  - Save button
  - Visual feedback for save status

### Data Flow
1. Settings will be stored in Chrome storage using chrome.storage.sync
2. API key will be stored securely
3. Settings will be validated before saving
4. Other parts of extension can access these settings through storage utils

### Storage Schema
```typescript
interface LLMSettings {
  apiKey: string;
  apiBase: string;
}
```

## Test Plan
1. Settings can be saved and persisted
2. API key is stored securely
3. Invalid inputs are properly handled
4. Settings can be retrieved from other parts of extension

## Tasks
[X] Task 1: Create basic options page UI with settings form
[X] Task 2: Implement settings storage and retrieval
[X] Task 3: Add validation and error handling
[ ] Task 4: Add visual feedback for save status