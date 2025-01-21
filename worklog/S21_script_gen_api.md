# Story 21: Script Generation API Integration

## Requirement
When user is signed in but API key is not set, use the script generation API endpoint to generate scripts.
- Endpoint: POST https://all-my-web-api.cloud6565.workers.dev/script
- Headers:
  - Authorization: Bearer <auth_token>
  - Content-Type: application/json
- Body: {"user_request": string}

## Design
1. Add script generation service in utils/llm.ts
2. Update script editor to use API when API key is not set
3. Handle API errors and display appropriate messages

## Tasks
[X] Task 1: Add script generation API service
- Add new function in llm.ts to call script generation API
- Add error handling and types
- Add unit tests

[X] Task 2: Integrate API with script editor
- Update script generation logic to use API when API key is not set
- Add loading state during API call
- Handle API errors in UI

## Test Plan
1. Unit tests:
- Test API service with mock responses
- Test error handling
- Test integration with auth token

2. Manual tests:
- Test script generation with valid auth token
- Test error cases (network error, invalid token)
- Verify loading states
- Verify error messages

## Progress
2024-03-21:
- Added script generation API service in llm.ts
- Added unit tests for API service
- Added error handling and types
- Updated script editor to use API when API key is not set
- Added loading state and error handling in UI
- Updated warning message to show both options (API key or sign in)