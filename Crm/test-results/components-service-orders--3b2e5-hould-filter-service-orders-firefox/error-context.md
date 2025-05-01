# Test info

- Name: Service Orders Kanban >> should filter service orders
- Location: F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\components\service-orders-kanban.spec.ts:22:7

# Error details

```
Error: browserContext._wrapApiCall: Test ended.
Browser logs:

<launching> C:\Users\koldbringer\AppData\Local\ms-playwright\firefox-1482\firefox\firefox.exe -no-remote -headless -profile C:\Users\KOLDBR~1\AppData\Local\Temp\playwright_firefoxdev_profile-i1mgbs -juggler-pipe -silent
<launched> pid=5392
[pid=5392][err] *** You are running in headless mode.
[pid=5392][err] JavaScript warning: resource://services-settings/Utils.sys.mjs, line 116: unreachable code after return statement
[pid=5392][out] console.warn: services.settings: Ignoring preference override of remote settings server
[pid=5392][out] console.warn: services.settings: Allow by setting MOZ_REMOTE_SETTINGS_DEVTOOLS=1 in the environment
[pid=5392][out] 
[pid=5392][out] Juggler listening to the pipe
[pid=5392][out] Crash Annotation GraphicsCriticalError: |[0][GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt (t=10.1934) [GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt
[pid=5392][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
[pid=5392][out] console.error: SearchEngineSelector: "Received empty search configuration!"
[pid=5392][out] console.error: "Received empty top sites configuration!"
[pid=5392][out] console.error: SearchEngineSelector: "Received empty search configuration!"
[pid=5392][out] console.error: SearchService: "#init: failure initializing search:" ({})
[pid=5392][out] console.error: "Received empty top sites configuration!"
[pid=5392][err] JavaScript error: resource://gre/modules/SearchEngineSelector.sys.mjs, line 100: NS_ERROR_UNEXPECTED: Failed to get engine data from Remote Settings
[pid=5392][err] JavaScript error: resource://gre/modules/SearchEngineSelector.sys.mjs, line 100: NS_ERROR_UNEXPECTED: Failed to get engine data from Remote Settings
[pid=5392][err] JavaScript error: resource://gre/modules/SearchEngineSelector.sys.mjs, line 100: NS_ERROR_UNEXPECTED: Failed to get engine data from Remote Settings
[pid=5392][err] JavaScript error: resource://gre/modules/SearchEngineSelector.sys.mjs, line 100: NS_ERROR_UNEXPECTED: Failed to get engine data from Remote Settings
[pid=5392][out] console.error: WebExtensions: 
[pid=5392][out]   Message: [Exception... "Failed to get engine data from Remote Settings"  nsresult: "0x8000ffff (NS_ERROR_UNEXPECTED)"  location: "JS frame :: resource://gre/modules/SearchEngineSelector.sys.mjs :: getEngineConfiguration :: line 100"  data: no]
[pid=5392][out]   Stack:
[pid=5392][out]     getEngineConfiguration@resource://gre/modules/SearchEngineSelector.sys.mjs:100:24
[pid=5392][out] 
[pid=5392][out] console.error: URLBar - Provider.UrlbarProviderSearchTips: ({})
[pid=5392][out] console.error: SearchSettings: "_write: Could not write to settings file:" (new Error("cannot write without any engine.", "resource://gre/modules/SearchSettings.sys.mjs", 280))
[pid=5392][out] console.error: ({})
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
   8 |     await page.getByLabel(/password/i).fill('blaeritipol');
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
> 22 |   test('should filter service orders', async ({ page }) => {
     |       ^ Error: browserContext._wrapApiCall: Test ended.
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