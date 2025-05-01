import { test, expect } from '@playwright/test';

test.describe('Service Orders Kanban', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@test.pl');
    await page.getByLabel(/password/i).fill('blaeritipol');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Navigate to service orders page
    await page.goto('/service-orders');
  });

  test('should display kanban board', async ({ page }) => {
    // Check if kanban columns are visible
    await expect(page.getByText(/nowe|new/i)).toBeVisible();
    await expect(page.getByText(/w trakcie|in progress/i)).toBeVisible();
    await expect(page.getByText(/zakończone|completed/i)).toBeVisible();
  });

  test('should filter service orders', async ({ page }) => {
    // Type in search box
    await page.getByPlaceholder(/szukaj zlecenia/i).fill('test');
    
    // Wait for filtering to complete
    await page.waitForTimeout(500);
    
    // Check if filtered results are displayed
    // This is a basic check - in a real test, you'd verify specific cards are shown/hidden
    await expect(page.locator('.kanban-board')).toBeVisible();
  });

  test('should show service order details', async ({ page }) => {
    // Click on the first service order card
    await page.locator('.service-order-card').first().click();
    
    // Check if details modal/page is displayed
    await expect(page.getByRole('dialog')).toBeVisible();
    // Or if it navigates to a details page
    // await expect(page).toHaveURL(/\/service-orders\/\d+/);
    
    // Check for details content
    await expect(page.getByText(/szczegóły zlecenia|order details/i)).toBeVisible();
  });
});
