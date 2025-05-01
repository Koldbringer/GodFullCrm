# Postęp prac

## Zrealizowane funkcjonalności
- Podstawowa struktura aplikacji Next.js z App Router.
- Integracja z Supabase Auth.
- Szkielet modułu mapowania urządzeń.
- System ładowania stron (`loading.tsx`).
- Strony-placeholdery dla Ustawień i Faktur.
- Podstawowa funkcjonalność przeciągnij i upuść w widoku Kanban zleceń serwisowych.
- Zaimplementowane moduły (szkielety/podstawowe wersje): Dashboard, Zarządzanie klientami (CRUD), Zlecenia, Urządzenia, Kalendarz, Lokalizacje, Magazyn (szkielet).
- Podstawowa konfiguracja Tailwind CSS.
- Globalna obsługa błędów (`app/error.tsx`, `app/global-error.tsx`).
- Strona 404 (`app/not-found.tsx`).

## Otwarte zadania
- [ ] Pełna integracja z mapami Leaflet (klastrowanie, optymalizacja wydajności).
- [ ] Ogólna optymalizacja wydajności dla dużych zestawów danych (nie tylko na mapach).
- [ ] Testy wydajnościowe modułu IoT.
- [ ] Implementacja trybu offline dla techników terenowych.
- [ ] Uzupełnienie brakujących elementów UI/UX (modułowe layouty, pełna dostępność WCAG, zunifikowane testy responsywności, zaawansowane widgety, i18n, PWA).
- [ ] Pełna integracja Fumadocs (dynamiczne generowanie dokumentów).
- [ ] Wdrożenie mechanizmów automatyzacji zarządzania kontraktami.
- [ ] Wdrożenie narzędzi deweloperskich i testowania (ESLint, Prettier, Jest, RTL, E2E, Storybook, CI/CD, API docs, logging, code review).
- [ ] Implementacja brakujących funkcji (zarządzanie dokumentami, zaawansowany CRM, moduły finansowe, magazyn, harmonogramowanie, zarządzanie użytkownikami, analityka, integracje zewnętrzne, komunikacja, bezpieczeństwo).

## Znane problemy
- Opóźnienia przy renderowaniu wielu markerów (związane z wydajnością map).
- Brak obsługi offline dla techników terenowych.
- Ograniczona walidacja formularzy.

## Testy i CI/CD
- Rozpoczęto prace nad testami jednostkowymi dla komponentów Kanban.
- Brak testów integracyjnych/E2E.
- Brak pipeline’u budującego/deployującego (GitHub Actions, Vercel).

## Ocena jakości kodu
- **TypeScript & Next.js** – dobre podstawy, wyraźna struktura `app/`
- **Styling** – Tailwind skonfigurowany, spójny design
- **Brak**:
  - Lintera (ESLint) i formatowania (Prettier) w CI
  - Testów (Jest/React Testing Library)
  - Dokumentacji API (Swagger / OpenAPI)
  - Mechanizmów logowania błędów i monitoringu (Sentry)
  - Procesu review (pull request templates)