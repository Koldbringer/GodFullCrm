# Test info

- Name: Navigation >> should navigate to customers page
- Location: F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\navigation\sidebar.spec.ts:26:7

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/password/i)

    at F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\navigation\sidebar.spec.ts:8:40
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
   3 | test.describe('Navigation', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Login before each test
   6 |     await page.goto('/login');
   7 |     await page.getByLabel(/email/i).fill('test@test.pl');
>  8 |     await page.getByLabel(/password/i).fill('blaeritipol');
     |                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
   9 |     await page.getByRole('button', { name: /sign in/i }).click();
  10 |     
  11 |     // Wait for navigation to complete
  12 |     await page.waitForURL(/\/dashboard|\/$/);
  13 |   });
  14 |
  15 |   test('should navigate to dashboard', async ({ page }) => {
  16 |     // Click on dashboard link in sidebar
  17 |     await page.getByRole('link', { name: /dashboard/i }).click();
  18 |     
  19 |     // Check if URL contains dashboard
  20 |     await expect(page).toHaveURL(/\/dashboard|\/$/);
  21 |     
  22 |     // Check if dashboard title is visible
  23 |     await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  24 |   });
  25 |
  26 |   test('should navigate to customers page', async ({ page }) => {
  27 |     // Click on customers link in sidebar
  28 |     await page.getByRole('link', { name: /klienci|customers/i }).click();
  29 |     
  30 |     // Check if URL contains customers
  31 |     await expect(page).toHaveURL(/\/customers/);
  32 |     
  33 |     // Check if customers title is visible
  34 |     await expect(page.getByRole('heading', { name: /klienci|customers/i })).toBeVisible();
  35 |   });
  36 |
  37 |   test('should navigate to service orders page', async ({ page }) => {
  38 |     // Click on service orders link in sidebar
  39 |     await page.getByRole('link', { name: /zlecenia|service orders/i }).click();
  40 |     
  41 |     // Check if URL contains service-orders
  42 |     await expect(page).toHaveURL(/\/service-orders/);
  43 |     
  44 |     // Check if service orders title is visible
  45 |     await expect(page.getByRole('heading', { name: /zlecenia|service orders/i })).toBeVisible();
  46 |   });
  47 | });
  48 |
```