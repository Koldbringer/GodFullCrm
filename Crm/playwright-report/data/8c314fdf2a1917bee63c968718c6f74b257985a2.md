# Test info

- Name: Kanban Drag and Drop >> should drag a card from New to In Progress
- Location: F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\components\kanban-drag-drop.spec.ts:15:7

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/password/i)

    at F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\components\kanban-drag-drop.spec.ts:8:40
```

# Page snapshot

```yaml
- link "Przejdź do treści":
  - /url: "#main-content"
- heading "GodLike HVAC CRM" [level=2]
- link "Dashboard":
  - /url: /
  - button "Dashboard":
    - img
    - text: Dashboard
- link "Klienci 12":
  - /url: /customers
  - button "Klienci 12":
    - img
    - text: Klienci 12
- link "Zlecenia 5":
  - /url: /service-orders
  - button "Zlecenia 5":
    - img
    - text: Zlecenia 5
- link "Urządzenia":
  - /url: /devices
  - button "Urządzenia":
    - img
    - text: Urządzenia
- link "Kalendarz":
  - /url: /calendar
  - button "Kalendarz":
    - img
    - text: Kalendarz
- link "Lokalizacje":
  - /url: /sites
  - button "Lokalizacje":
    - img
    - text: Lokalizacje
- link "Mapa":
  - /url: /map
  - button "Mapa":
    - img
    - text: Mapa
- link "Magazyn":
  - /url: /inventory
  - button "Magazyn":
    - img
    - text: Magazyn
- link "Pracownicy":
  - /url: /employees
  - button "Pracownicy":
    - img
    - text: Pracownicy
- link "Zgłoszenia 3":
  - /url: /tickets
  - button "Zgłoszenia 3":
    - img
    - text: Zgłoszenia 3
- link "Automatyzacja":
  - /url: /automation
  - button "Automatyzacja":
    - img
    - text: Automatyzacja
- button "Dokumenty":
  - img
  - text: Dokumenty
  - img
- link "Flota":
  - /url: /fleet
  - button "Flota":
    - img
    - text: Flota
- link "Monitoring":
  - /url: /monitoring
  - button "Monitoring":
    - img
    - text: Monitoring
- link "Raporty":
  - /url: /reports
  - button "Raporty":
    - img
    - text: Raporty
- link "Ustawienia":
  - /url: /settings
  - button "Ustawienia":
    - img
    - text: Ustawienia
- link "Pomoc":
  - /url: /help
  - button "Pomoc":
    - img
    - text: Pomoc
- button "Collapse Sidebar":
  - img
  - text: Collapse Sidebar
- main:
  - heading "GodLike HVAC CRM ERP" [level=1]
  - paragraph: Zaloguj się, aby kontynuować
  - heading "Logowanie" [level=2]
  - text: Adres email
  - textbox "Adres email": test@test.pl
  - text: Hasło
  - textbox "Hasło": blaeritipol
  - button:
    - img
  - button "Zaloguj się"
  - button "Załóż konto"
  - link "Zapomniałeś hasła?":
    - /url: /forgot-password
  - paragraph: © 2024 GodLike HVAC CRM ERP. Wszelkie prawa zastrzeżone.
  - region "Notifications alt+T"
- region "Notifications alt+T"
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Kanban Drag and Drop', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Login before each test
   6 |     await page.goto('/login');
   7 |     await page.getByLabel(/email/i).fill('test@test.pl');
>  8 |     await page.getByLabel(/password/i).fill('blaeritipol');
     |                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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