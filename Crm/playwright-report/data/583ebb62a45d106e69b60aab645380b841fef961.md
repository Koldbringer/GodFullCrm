# Test info

- Name: Authentication >> should login with valid credentials
- Location: F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\auth\login.spec.ts:28:7

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/password/i)

    at F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\auth\login.spec.ts:33:40
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
   3 | test.describe('Authentication', () => {
   4 |   test('should show login form', async ({ page }) => {
   5 |     await page.goto('/login');
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
> 33 |     await page.getByLabel(/password/i).fill('blaeritipol');
     |                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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