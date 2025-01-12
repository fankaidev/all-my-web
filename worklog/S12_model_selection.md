# Story: Add Model Selection in Options Page

## User Requirement
Add ability to select different AI models in the options page. This will allow users to choose which model to use for script generation and editing.

## System Design

### Data Model
```typescript
interface ModelConfig {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
}

interface ModelSettings {
  selectedModel: string;
  models: ModelConfig[];
}
```

### Components
1. ModelSelector component in options page
   - Dropdown to select model
   - Description of selected model
   - Save button to persist selection

### State Management
- Add modelStore using Zustand
- Persist model selection in chrome.storage.sync
- Default to most capable model

### Data Flow
1. Load available models and current selection on options page mount
2. User selects model from dropdown
3. Save selection to storage
4. Background service reads model setting when making AI requests

## Test Plan

### Unit Tests
1. ModelSelector component
   - Renders available models
   - Shows current selection
   - Handles model change
   - Saves selection

2. modelStore
   - Initializes with default model
   - Updates selected model
   - Persists changes to storage
   - Loads from storage

### Integration Tests
1. Options page
   - Loads saved model selection
   - Updates UI on model change
   - Persists changes across page reloads

## Tasks
[X] Task 1: Implement model selection
    - Define types and create model store with Zustand
    - Create ModelSelector component and add to options page
    - Add tests for store and component

[X] Task 2: Update AI service integration
    - Update AI service to use selected model
    - Add integration tests for model selection flow