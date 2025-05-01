# Testing in CRM/ERP System

This document explains how to run and write tests for the CRM/ERP system.

## Testing Frameworks

The project uses two main testing frameworks:

1. **Playwright** - For end-to-end testing with better reliability and modern features
2. **Cypress** - For end-to-end testing with a user-friendly interface

Additionally, we use Jest for unit and component testing.

## Running Tests

### Playwright Tests

```bash
# Run all Playwright tests
npm run test:playwright

# Run Playwright tests with UI
npm run test:playwright:ui

# Run a specific test file
npx playwright test tests/playwright/components/kanban-drag-drop.spec.ts
```

### Cypress Tests

```bash
# Run all Cypress tests in headless mode
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open
```

### Jest Tests

```bash
# Run all Jest tests
npm run test

# Run Jest tests in watch mode
npm run test:watch
```

## Test Structure

### Playwright Tests

Playwright tests are located in the `tests/playwright` directory and are organized by feature:

- `tests/playwright/auth` - Authentication tests
- `tests/playwright/navigation` - Navigation tests
- `tests/playwright/components` - Component tests

### Cypress Tests

Cypress tests are located in the `cypress/e2e` directory and follow a similar structure:

- `cypress/e2e/auth` - Authentication tests
- `cypress/e2e/navigation` - Navigation tests
- `cypress/e2e/components` - Component tests

## Writing Tests

### Best Practices

1. **Test isolation**: Each test should be independent and not rely on the state from other tests
2. **Use test data**: Create test data at the beginning of the test and clean up afterward
3. **Use page objects**: For complex pages, create page object models to encapsulate selectors and actions
4. **Test real user flows**: Focus on testing real user scenarios rather than implementation details
5. **Keep tests simple**: Each test should verify one specific behavior

### Example Test

```typescript
// Playwright example
test('should login with valid credentials', async ({ page }) => {
  await page.goto('/login');
  
  // Fill in valid credentials
  await page.getByLabel(/email/i).fill('test@test.pl');
  await page.getByLabel(/password/i).fill('blaeritipol');
  
  // Submit the form
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Check if redirected to dashboard
  await expect(page).toHaveURL(/\/dashboard|\/$/);
});
```

```javascript
// Cypress example
it('should login with valid credentials', () => {
  cy.visit('/login');
  
  // Fill in valid credentials
  cy.findByLabelText(/email/i).type('test@test.pl');
  cy.findByLabelText(/password/i).type('blaeritipol');
  
  // Submit the form
  cy.findByRole('button', { name: /sign in/i }).click();
  
  // Check if redirected to dashboard
  cy.url().should('match', /\/dashboard|\/$/);
});
```

## Continuous Integration

Tests are automatically run in the CI/CD pipeline on GitHub Actions. The configuration is in `.github/workflows/ci.yml`.

## Troubleshooting

If tests are failing, check the following:

1. Is the application running on the expected port (3000)?
2. Are the test credentials valid?
3. Has the UI changed since the tests were written?
4. Are there any network issues or API rate limits?

For more help, check the error messages and screenshots in the test results.
