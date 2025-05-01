import { test, expect } from '@playwright/test';

test.describe('Kanban Drag and Drop', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@test.pl');
    await page.getByLabel(/password/i).fill('blaeritipol');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Navigate to service orders page
    await page.goto('/service-orders');
  });

  test('should drag a card from New to In Progress', async ({ page }) => {
    // Wait for the kanban board to load
    await page.waitForSelector('.kanban-board');
    
    // Get the first card in the "New" column
    const newCard = await page.locator('.kanban-column:has-text("Nowe") .service-order-card').first();
    
    // Get the "In Progress" column
    const inProgressColumn = await page.locator('.kanban-column:has-text("W trakcie")');
    
    // Get the card ID before dragging
    const cardId = await newCard.getAttribute('data-id');
    
    // Perform drag and drop
    await newCard.dragTo(inProgressColumn);
    
    // Wait for the backend to update
    await page.waitForTimeout(1000);
    
    // Verify the card is now in the "In Progress" column
    await expect(page.locator(`.kanban-column:has-text("W trakcie") .service-order-card[data-id="${cardId}"]`)).toBeVisible();
  });

  test('should drag a card from In Progress to Completed', async ({ page }) => {
    // Wait for the kanban board to load
    await page.waitForSelector('.kanban-board');
    
    // Get the first card in the "In Progress" column
    const inProgressCard = await page.locator('.kanban-column:has-text("W trakcie") .service-order-card').first();
    
    // Get the "Completed" column
    const completedColumn = await page.locator('.kanban-column:has-text("Zakończone")');
    
    // Get the card ID before dragging
    const cardId = await inProgressCard.getAttribute('data-id');
    
    // Perform drag and drop
    await inProgressCard.dragTo(completedColumn);
    
    // Wait for the backend to update
    await page.waitForTimeout(1000);
    
    // Verify the card is now in the "Completed" column
    await expect(page.locator(`.kanban-column:has-text("Zakończone") .service-order-card[data-id="${cardId}"]`)).toBeVisible();
  });
});
