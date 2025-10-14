# Cypress Test Suite for Ninjacart Login Portal

This directory contains comprehensive Cypress tests for the login portal, covering form validation, API integration, and end-to-end user flows.

## Test Files

### 1. `login-form-validation.cy.ts`
Tests for client-side form validation including:
- Username field validation (email/phone format)
- Password field validation (minimum length)
- Form submission validation
- Password visibility toggle
- Remember me functionality
- Accessibility features
- Form reset and clear functionality

### 2. `api-integration.cy.ts`
Tests for API integration including:
- Successful login API calls
- Error handling (401, 403, 500, network errors)
- Offline scenario handling
- API request validation (headers, body format)
- Loading states and UI feedback
- Multiple login attempts
- Response data handling

### 3. `login-complete-flow.cy.ts`
End-to-end integration tests including:
- Complete login flow with valid credentials
- Error handling and retry scenarios
- Cross-browser compatibility
- Performance and timing tests
- Accessibility and UX testing

## Custom Commands

The test suite includes several custom Cypress commands:

- `cy.dataCy(value)` - Select elements by data-cy attribute
- `cy.login(username, password)` - Fill and submit login form
- `cy.clearStorage()` - Clear localStorage and sessionStorage
- `cy.mockLoginApi(responseType)` - Mock API responses for different scenarios

## Running Tests

### Prerequisites
1. Install dependencies: `npm install`
2. Install Cypress: `npm install --save-dev cypress`
3. Start the development server: `npm run dev`

### Run Tests

**Open Cypress Test Runner:**
```bash
npx cypress open
```

**Run tests in headless mode:**
```bash
npx cypress run
```

**Run specific test file:**
```bash
npx cypress run --spec "cypress/e2e/login-form-validation.cy.ts"
```

**Run tests in specific browser:**
```bash
npx cypress run --browser chrome
```

## Test Configuration

The tests are configured in `cypress.config.ts` with:
- Base URL: `http://localhost:5173`
- Viewport: 1280x720
- Timeout: 10 seconds
- Video recording: Disabled
- Screenshot on failure: Enabled

## API Mocking

Tests use Cypress intercepts to mock the Ninjacart login API:
- **Success Response**: 200 status with success data
- **Error Response**: 401 status with error message
- **Network Error**: Simulated network failure
- **Custom Responses**: For specific test scenarios

## Test Data

The tests use the following test credentials:
- Username: `NC23550`
- Password: `123Ninja@`
- Email: `user@example.com`
- Phone: `+1234567890`

## Coverage Areas

### Form Validation
- ✅ Empty field validation
- ✅ Email format validation
- ✅ Phone format validation
- ✅ Password length validation
- ✅ Real-time validation feedback
- ✅ Form submission validation

### API Integration
- ✅ Successful login flow
- ✅ Error handling (401, 403, 500)
- ✅ Network error handling
- ✅ Offline scenario handling
- ✅ Request header validation
- ✅ Request body validation
- ✅ Response data handling

### User Experience
- ✅ Loading states
- ✅ Error messages
- ✅ Success feedback
- ✅ Remember me functionality
- ✅ Password visibility toggle
- ✅ Keyboard navigation
- ✅ Screen reader support

### Performance
- ✅ Slow API response handling
- ✅ Rapid form submission prevention
- ✅ Cross-browser compatibility
- ✅ Responsive design testing

## Debugging

### View Test Results
- Screenshots are saved in `cypress/screenshots/` on failure
- Videos are saved in `cypress/videos/` (if enabled)
- Console logs are captured during test execution

### Debug Mode
Run tests in debug mode to step through execution:
```bash
npx cypress open --config video=false
```

### Custom Commands
Use custom commands in your tests:
```javascript
cy.login('NC23550', '123Ninja@')
cy.mockLoginApi('success')
cy.clearStorage()
```

## Best Practices

1. **Isolation**: Each test is independent and clears state
2. **Mocking**: API calls are mocked for consistent testing
3. **Accessibility**: Tests verify ARIA attributes and keyboard navigation
4. **Error Handling**: Comprehensive error scenario coverage
5. **Performance**: Tests verify loading states and timing
6. **Cross-browser**: Tests work across different viewport sizes

## Troubleshooting

### Common Issues

1. **Tests failing due to CORS**: Ensure the dev server is running on the correct port
2. **API mocking not working**: Check that intercepts are set up before API calls
3. **Element not found**: Verify element selectors match the actual DOM
4. **Timeout errors**: Increase timeout values in configuration if needed

### Debug Commands

```bash
# Run with debug output
DEBUG=cypress:* npx cypress run

# Run specific test with verbose output
npx cypress run --spec "cypress/e2e/login-form-validation.cy.ts" --reporter spec
```
