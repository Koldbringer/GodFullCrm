# Plan rozwoju interfejsu V2

## 1. Podsumowanie stanu obecnego
- Globalny layout: `app/layout.tsx` ze Sidebar i Header.
- Moduły mają page.tsx i loading.tsx, ale brak własnych layoutów dla nested routes.
- Komponenty atomowe + UI w `components/ui` są zaimplementowane.
- Brak Storybook, testów E2E/unity, i18n, PWA/offline.

## 2. Braki w interfejsie
1. Modułowe layouty:
   - Tylko `calendar` posiada własny layout.tsx.
   - Pozostałe moduły wymagają layoutów dla spójności UI.
2. Obsługa błędów:
   - Brak globalnego `app/error.tsx` (ErrorBoundary).
   - Spinner/loading indicator tylko w lokalnych loading.tsx.
3. Nawigacja:
   - Brak strony 404 i fallbacków na nieznane ścieżki.
   - ARIA: część komponentów wymaga aria-label, role.
4. Responsywność:
   - Widoki mobilne istnieją, ale nie wszystkie komponenty przetestowane na breakpoints.
5. Widgety UX:
   - Brak panelu szybkiego dostępu (skrótów).
   - Brak inteligentnego centrum powiadomień.
6. Zaawansowane funkcje:
   - Brak asystenta AI (chatbot) i widgetów KPI.
7. Narzędzia deweloperskie:
   - Brak Storybook + folderów atoms/molecules/organisms.
   - Brak struktury testów: __tests__, cypress.config.js, jest.config.js.
8. Internationalization:
   - Hard-coded stringi po polsku, brak next-i18next.
9. PWA/offline:
   - Brak manifest.json i service worker.

## 3. Zalecane kroki
- ✅ Utworzyć layout.tsx w każdym module z nested routes.
- ✅ Dodać `app/error.tsx` z ErrorBoundary i globalny spinner.
- ✅ Wprowadzić stronę 404 i fallback layout.
- Przejść wszystkie komponenty pod WCAG 2.1, dodać testy axe-core.
- Zunifikować breakpoints i testy responsywności.
- ✅ Skonfigurować katalog atoms/molecules/organisms.
- Skonfigurować Storybook dla dokumentacji komponentów.
- Dodać i18n (next-i18next), przenieść wszystkie stringi do translations.
- Wdrożyć PWA (next-pwa), service worker, manifest.
- Zaprojektować i zaimplementować panel AI + widgety KPI.

## 4. Testy i narzędzia
- **Unit Tests**: coverage > 90%, mocki Supabase, React Testing Library.
- **Integration Tests**: testy cross-module flows (customers ↔ orders, sites ↔ devices).
- **E2E Tests**: Cypress/Playwright scenariusze CRUD, raporty, obsługa błędów.
- **Accessibility Tests**: axe-core, aria-label, kontrasty, nawigacja klawiaturą.
- **Visual Regression**: Percy/Chromatic na wszystkich breakpoints.
- **Performance Tests**: Lighthouse CI z budżetami LCP, FID, CLS.
- **Security Tests**: npm audit, Snyk, testy middleware/auth guard.
- **CI/CD**: GitHub Actions, Codecov, alerty przy spadku coverage.

## 5. Harmonogram V2
- Faza 1: Layouty i error handling – 1 tydz.
- Faza 2: Storybook i i18n – 1 tydz.
- Faza 3: PWA + zaawansowane widgety – 2 tyg.
- Faza 4: Testy i CI – 1 tydz.
- Faza 5: Optymalizacje wydajności – 1 tydz.

## 6. Mierniki sukcesu
- Coverage ≥ 95%.
- Brak krytycznych regresji UI.
- WCAG 2.1 zgodność ≥ AAA.
- PWA offline sync 100%.
- Dashboard KPI: realtime updates.
