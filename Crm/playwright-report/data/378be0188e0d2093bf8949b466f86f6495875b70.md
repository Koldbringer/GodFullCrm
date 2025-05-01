# Test info

- Name: Service Orders Kanban >> should display kanban board
- Location: F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\components\service-orders-kanban.spec.ts:15:7

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/password/i)

    at F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\components\service-orders-kanban.spec.ts:8:40
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
   3 | test.describe('Service Orders Kanban', () => {
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
  15 |   test('should display kanban board', async ({ page }) => {
  16 |     // Check if kanban columns are visible
  17 |     await expect(page.getByText(/nowe|new/i)).toBeVisible();
  18 |     await expect(page.getByText(/w trakcie|in progress/i)).toBeVisible();
  19 |     await expect(page.getByText(/zakończone|completed/i)).toBeVisible();
  20 |   });
  21 |
  22 |   test('should filter service orders', async ({ page }) => {
  23 |     // Type in search box
  24 |     await page.getByPlaceholder(/szukaj zlecenia/i).fill('test');
  25 |     
  26 |     // Wait for filtering to complete
  27 |     await page.waitForTimeout(500);
  28 |     
  29 |     // Check if filtered results are displayed
  30 |     // This is a basic check - in a real test, you'd verify specific cards are shown/hidden
  31 |     await expect(page.locator('.kanban-board')).toBeVisible();
  32 |   });
  33 |
  34 |   test('should show service order details', async ({ page }) => {
  35 |     // Click on the first service order card
  36 |     await page.locator('.service-order-card').first().click();
  37 |     
  38 |     // Check if details modal/page is displayed
  39 |     await expect(page.getByRole('dialog')).toBeVisible();
  40 |     // Or if it navigates to a details page
  41 |     // await expect(page).toHaveURL(/\/service-orders\/\d+/);
  42 |     
  43 |     // Check for details content
  44 |     await expect(page.getByText(/szczegóły zlecenia|order details/i)).toBeVisible();
  45 |   });
  46 | });
  47 |
```