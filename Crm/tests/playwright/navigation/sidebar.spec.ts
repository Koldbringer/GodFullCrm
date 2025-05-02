import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@test.pl');
    await page.getByLabel(/password/i).fill('blaeritipol');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for navigation to complete
    await page.waitForURL(/\/dashboard|\/$/);
  });

  test('should navigate to dashboard', async ({ page }) => {
    // Click on dashboard link in sidebar
    await page.getByRole('link', { name: /dashboard/i }).click();
    
    // Check if URL contains dashboard
    await expect(page).toHaveURL(/\/dashboard|\/$/);
    
    // Check if dashboard title is visible
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should navigate to customers page', async ({ page }) => {
    // Click on customers link in sidebar
    await page.getByRole('link', { name: /klienci|customers/i }).click();
    
    // Check if URL contains customers
    await expect(page).toHaveURL(/\/customers/);
    
    // Check if customers title is visible
    await expect(page.getByRole('heading', { name: /klienci|customers/i })).toBeVisible();
  });

  test('should navigate to service orders page', async ({ page }) => {
    // Click on service orders link in sidebar
    await page.getByRole('link', { name: /zlecenia|service orders/i }).click();
    
    // Check if URL contains service-orders
    await expect(page).toHaveURL(/\/service-orders/);
    
    // Check if service orders title is visible
    await expect(page.getByRole('heading', { name: /zlecenia|service orders/i })).toBeVisible();
  });
});
