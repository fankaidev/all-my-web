# Story 6: Implement AI-powered script editor

## Requirements
- Add a "requirement" field to script interface
- Display requirement field as a text area above script body
- Add a "Generate" button below requirement field
- When clicked, use LLM settings from options page to call OpenAI API
- Generate script body based on requirement

## Design
### Script Interface
```typescript
interface Script {
    id: number;
    name: string;
    requirement: string;  // new field
    body: string;
}
```

### Tasks
[X] Task 1: Update script interface and storage
- Add requirement field to Script interface
- Update script editor UI to include requirement field
- Migrate existing scripts in storage

[X] Task 2: Add script generation feature
- Add generate button in script editor
- Implement OpenAI API call using settings from options page
- Update script body with generated code