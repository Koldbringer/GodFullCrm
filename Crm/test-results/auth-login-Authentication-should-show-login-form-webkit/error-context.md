# Test info

- Name: Authentication >> should show login form
- Location: F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\auth\login.spec.ts:4:7

# Error details

```
Error: page.goto: Test ended.
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

    at F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\auth\login.spec.ts:5:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Authentication', () => {
   4 |   test('should show login form', async ({ page }) => {
>  5 |     await page.goto('/login');
     |                ^ Error: page.goto: Test ended.
   6 |     
   7 |     // Check if login form elements are present
   8 |     await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
   9 |     await expect(page.getByLabel(/email/i)).toBeVisible();
  10 |     await expect(page.getByLabel(/password/i)).toBeVisible();
  11 |     await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  12 |   });
  13 |
  14 |   test('should show error with invalid credentials', async ({ page }) => {
  15 |     await page.goto('/login');
  16 |     
  17 |     // Fill in invalid credentials
  18 |     await page.getByLabel(/email/i).fill('invalid@example.com');
  19 |     await page.getByLabel(/password/i).fill('wrongpassword');
  20 |     
  21 |     // Submit the form
  22 |     await page.getByRole('button', { name: /sign in/i }).click();
  23 |     
  24 |     // Check for error message
  25 |     await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 5000 });
  26 |   });
  27 |
  28 |   test('should login with valid credentials', async ({ page }) => {
  29 |     await page.goto('/login');
  30 |     
  31 |     // Fill in valid credentials (use test account)
  32 |     await page.getByLabel(/email/i).fill('test@test.pl');
  33 |     await page.getByLabel(/password/i).fill('blaeritipol');
  34 |     
  35 |     // Submit the form
  36 |     await page.getByRole('button', { name: /sign in/i }).click();
  37 |     
  38 |     // Check if redirected to dashboard
  39 |     await expect(page).toHaveURL(/\/dashboard|\/$/);
  40 |     
  41 |     // Check if user is logged in (e.g., user menu is visible)
  42 |     await expect(page.getByRole('button', { name: /user menu/i })).toBeVisible({ timeout: 5000 });
  43 |   });
  44 | });
  45 |
```