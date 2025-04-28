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

## Używane biblioteki / Technologie

### @atlaskit

What is @atlaskit?
The Pragmatic drag and drop packages are published under the @atlaskit namespace on npm

```javascript
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
### Pragmatic Drag and Drop

Biblioteka do implementacji funkcji przeciągnij i upuść. Umożliwia tworzenie przeciągalnych elementów, celów upuszczania oraz monitorowanie operacji drag and drop. Posiada wsparcie dla React/TypeScript i narzędzia do testowania.

- Implementacja `draggable` dla elementów.
- Tworzenie `dropTargetForElements` z walidacją typu.
- Użycie `monitorForElements` do globalnego śledzenia.
- Przykłady testowania z Cypress i Testing Library.
- Wskazówki dotyczące typowania danych (np. z użyciem Symboli).
- Optymalizacje dla React.
```