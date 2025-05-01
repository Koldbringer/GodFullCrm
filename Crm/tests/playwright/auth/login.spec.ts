import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    
    // Check if login form elements are present
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for error message
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 5000 });
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in valid credentials (use test account)
    await page.getByLabel(/email/i).fill('test@test.pl');
    await page.getByLabel(/password/i).fill('blaeritipol');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check if redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard|\/$/);
    
    // Check if user is logged in (e.g., user menu is visible)
    await expect(page.getByRole('button', { name: /user menu/i })).toBeVisible({ timeout: 5000 });
  });
});
