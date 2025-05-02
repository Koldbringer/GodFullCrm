# Test info

- Name: Navigation >> should navigate to customers page
- Location: F:\Proejktowe\GodLikeCrmERP\Crm\tests\playwright\navigation\sidebar.spec.ts:26:7

# Error details

```
Error: browserContext._wrapApiCall: Test ended.
Browser logs:

<launching> C:\Users\koldbringer\AppData\Local\ms-playwright\firefox-1482\firefox\firefox.exe -no-remote -headless -profile C:\Users\KOLDBR~1\AppData\Local\Temp\playwright_firefoxdev_profile-rsdJG4 -juggler-pipe -silent
<launched> pid=61168
[pid=61168][err] *** You are running in headless mode.
[pid=61168][err] JavaScript warning: resource://services-settings/Utils.sys.mjs, line 116: unreachable code after return statement
[pid=61168][out] console.warn: services.settings: Ignoring preference override of remote settings server
[pid=61168][out] console.warn: services.settings: Allow by setting MOZ_REMOTE_SETTINGS_DEVTOOLS=1 in the environment
[pid=61168][out] 
[pid=61168][out] Juggler listening to the pipe
[pid=61168][out] Crash Annotation GraphicsCriticalError: |[0][GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt (t=19.1129) [GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt
[pid=61168][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
[pid=61168][out] console.error: SearchEngineSelector: "Received empty search configuration!"
[pid=61168][out] console.error: "Received empty top sites configuration!"
[pid=61168][out] console.error: SearchEngineSelector: "Received empty search configuration!"
[pid=61168][out] console.error: SearchService: "#init: failure initializing search:" ({})
[pid=61168][out] console.error: "Received empty top sites configuration!"
[pid=61168][err] JavaScript error: resource://gre/modules/SearchEngineSelector.sys.mjs, line 100: NS_ERROR_UNEXPECTED: Failed to get engine data from Remote Settings
[pid=61168][err] JavaScript error: resource://gre/modules/SearchEngineSelector.sys.mjs, line 100: NS_ERROR_UNEXPECTED: Failed to get engine data from Remote Settings
[pid=61168][err] JavaScript error: resource://gre/modules/SearchEngineSelector.sys.mjs, line 100: NS_ERROR_UNEXPECTED: Failed to get engine data from Remote Settings
[pid=61168][err] JavaScript error: resource://gre/modules/SearchEngineSelector.sys.mjs, line 100: NS_ERROR_UNEXPECTED: Failed to get engine data from Remote Settings
[pid=61168][out] console.error: WebExtensions: 
[pid=61168][out]   Message: [Exception... "Failed to get engine data from Remote Settings"  nsresult: "0x8000ffff (NS_ERROR_UNEXPECTED)"  location: "JS frame :: resource://gre/modules/SearchEngineSelector.sys.mjs :: getEngineConfiguration :: line 100"  data: no]
[pid=61168][out]   Stack:
[pid=61168][out]     getEngineConfiguration@resource://gre/modules/SearchEngineSelector.sys.mjs:100:24
[pid=61168][out] 
[pid=61168][out] console.error: URLBar - Provider.UrlbarProviderSearchTips: ({})
[pid=61168][out] console.error: SearchSettings: "_write: Could not write to settings file:" (new Error("cannot write without any engine.", "resource://gre/modules/SearchSettings.sys.mjs", 280))
[pid=61168][out] console.error: ({})
[pid=61168][err] JavaScript error: http://localhost:3000/_next/static/chunks/app/layout.js, line 458: SyntaxError: "" literal not terminated before end of script
[pid=61168][err] JavaScript error: chrome://juggler/content/content/Runtime.js, line 167: TypeError: message.stack is null
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
   8 |     await page.getByLabel(/password/i).fill('blaeritipol');
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
> 26 |   test('should navigate to customers page', async ({ page }) => {
     |       ^ Error: browserContext._wrapApiCall: Test ended.
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