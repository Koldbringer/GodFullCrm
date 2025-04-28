# Architektura systemu

## Główne komponenty
1. Frontend: Next.js 13 z App Router
2. Autentykacja: Supabase Auth
3. Baza danych: Supabase Postgres
4. Mapy: React Leaflet z klastrowaniem

## Kluczowe decyzje
- Architektura oparta o Atomic Design
- Separacja logiki biznesowej i UI
- Wykorzystanie Server Components w Next.js
- Integracja z Supabase przez warstwę API

## Wzorce projektowe
- Provider Pattern dla kontekstu autentykacji
- Factory Pattern dla generatorów raportów
- Observer Pattern dla śledzenia urządzeń IoT