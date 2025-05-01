# Bieżący kontekst projektu

## Priorytety rozwojowe
- Optymalizacja wydajności (mapy i ogólna).
- Implementacja trybu offline.
- Uzupełnienie fundamentów UI/UX i narzędzi deweloperskich (layouty, obsługa błędów, 404, linting, formatowanie, podstawowe testy).
- Integracja Fumadocs.
- Automatyzacja kontraktów.

## Ostatnie zmiany
- Dodano podstawową integrację z mapami.
- Wdrożenie systemu ładowania stron (loading.tsx).
- Rozbudowa komponentów UI.
- Zaimplementowano globalną obsługę błędów (`app/error.tsx`, `app/global-error.tsx`) i stronę 404 (`app/not-found.tsx`).
- Rozpoczęto prace nad testami jednostkowymi dla komponentów Kanban.

## Kluczowe decyzje
- Wybór Next.js jako frameworka frontendowego (App Router).
- Wykorzystanie TypeScript dla bezpieczeństwa typów.
- Architektura oparta o komponenty Atomic Design.
- Wykorzystanie Supabase (Auth i Postgres).
- Wykorzystanie React Leaflet dla map.
- Wykorzystanie Pragmatic Drag and Drop dla funkcji przeciągnij i upuść.
- Decyzja o dynamicznie generowanych linkach zamiast PDF dla ofert/raportów (z wykorzystaniem Fumadocs).
- Planowana integracja Rete.js dla wizualnego edytora automatyzacji.