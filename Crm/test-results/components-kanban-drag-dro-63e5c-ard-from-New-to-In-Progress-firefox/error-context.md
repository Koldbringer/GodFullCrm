# Test info

- Name: Kanban Drag and Drop >> should drag a card from New to In Progress
- Location: F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\components\kanban-drag-drop.spec.ts:15:7

# Error details

```
Error: locator.fill: Target page, context or browser has been closed
Call log:
  - waiting for getByLabel(/email/i)
    - locator resolved to <input id="email" required="" type="email" value="test@test.pl" autocomplete="username" placeholder="nazwa@firma.pl" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
    - fill("test@test.pl")
  - attempting fill action
    - waiting for element to be visible, enabled and editable

    at F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\components\kanban-drag-drop.spec.ts:7:37
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Kanban Drag and Drop', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Login before each test
   6 |     await page.goto('/login');
>  7 |     await page.getByLabel(/email/i).fill('test@test.pl');
     |                                     ^ Error: locator.fill: Target page, context or browser has been closed
   8 |     await page.getByLabel(/password/i).fill('blaeritipol');
   9 |     await page.getByRole('button', { name: /sign in/i }).click();
  10 |     
  11 |     // Navigate to service orders page
  12 |     await page.goto('/service-orders');
  13 |   });
  14 |
  15 |   test('should drag a card from New to In Progress', async ({ page }) => {
  16 |     // Wait for the kanban board to load
  17 |     await page.waitForSelector('.kanban-board');
  18 |     
  19 |     // Get the first card in the "New" column
  20 |     const newCard = await page.locator('.kanban-column:has-text("Nowe") .service-order-card').first();
  21 |     
  22 |     // Get the "In Progress" column
  23 |     const inProgressColumn = await page.locator('.kanban-column:has-text("W trakcie")');
  24 |     
  25 |     // Get the card ID before dragging
  26 |     const cardId = await newCard.getAttribute('data-id');
  27 |     
  28 |     // Perform drag and drop
  29 |     await newCard.dragTo(inProgressColumn);
  30 |     
  31 |     // Wait for the backend to update
  32 |     await page.waitForTimeout(1000);
  33 |     
  34 |     // Verify the card is now in the "In Progress" column
  35 |     await expect(page.locator(`.kanban-column:has-text("W trakcie") .service-order-card[data-id="${cardId}"]`)).toBeVisible();
  36 |   });
  37 |
  38 |   test('should drag a card from In Progress to Completed', async ({ page }) => {
  39 |     // Wait for the kanban board to load
  40 |     await page.waitForSelector('.kanban-board');
  41 |     
  42 |     // Get the first card in the "In Progress" column
  43 |     const inProgressCard = await page.locator('.kanban-column:has-text("W trakcie") .service-order-card').first();
  44 |     
  45 |     // Get the "Completed" column
  46 |     const completedColumn = await page.locator('.kanban-column:has-text("Zakończone")');
  47 |     
  48 |     // Get the card ID before dragging
  49 |     const cardId = await inProgressCard.getAttribute('data-id');
  50 |     
  51 |     // Perform drag and drop
  52 |     await inProgressCard.dragTo(completedColumn);
  53 |     
  54 |     // Wait for the backend to update
  55 |     await page.waitForTimeout(1000);
  56 |     
  57 |     // Verify the card is now in the "Completed" column
  58 |     await expect(page.locator(`.kanban-column:has-text("Zakończone") .service-order-card[data-id="${cardId}"]`)).toBeVisible();
  59 |   });
  60 | });
  61 |
```