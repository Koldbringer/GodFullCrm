# kombajn

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.vercel.app) - learn about Fumadocs

## Tailwind CSS Configuration
Dodano plik `tailwind.config.js` z konfiguracją ścieżek:
```js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: { extend: {} },
  plugins: [],
};
```

## Pragmatic Drag-and-Drop Implementation
Aby zaimplementować komponent drag-and-drop zgodnie z dokumentacją Atlassian, wykonaj kroki:
1. Zainstaluj pakiety:
```bash
npm install @atlaskit/pragmatic-drag-and-drop @atlaskit/pragmatic-drag-and-drop-react
```
2. Zaimportuj i skonfiguruj provider:
```jsx
import { DragDropProvider } from '@atlaskit/pragmatic-drag-and-drop-react';
import HTML5Backend from '@atlaskit/pragmatic-drag-and-drop-backend-html5';

function App() {
  return (
    <DragDropProvider backend={HTML5Backend}>
      {/* Twoja aplikacja */}
    </DragDropProvider>
  );
}
```
3. Używaj komponentów `Draggable` i `Droppable`. Szczegóły i przykłady znajdziesz w [dokumentacji Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/about).

## Raport integracji Pragmatic Drag-and-Drop Atlassian

Poniżej znajduje się szczegółowy raport opisujący rekomendowane punkty integracji komponentów drag-and-drop Atlassian w projekcie:

### 1. Przegląd architektury
- Moduł główny: `Crm/kombajn` (Next.js + Fumadocs)
- Kluczowe sekcje UI:
  - Lista klientów (`app/customers`)
  - Zarządzanie zleceniami (`app/orders`)
  - Kalendarz (`app/calendar`)
  - Magazyn (`app/warehouse`)
  - Urządzenia (`app/devices`)

### 2. Rekomendowane punkty integracji
1. **Lista klientów** (`app/customers/page.tsx`)
   - Zastąp statyczny komponent listy na `DraggableList` do zmiany kolejności
   - Dodaj `Droppable` na poziomie grup klientów
2. **Zarządzanie zleceniami** (`app/orders/page.tsx`)
   - Umożliw przenoszenie zadań pomiędzy statusami: użyj `Draggable` dla elementów zleceń oraz `Droppable` w kolumnach Kanban
3. **Kalendarz** (`app/calendar/page.tsx`)
   - Dodaj `Draggable` dla wydarzeń i `Droppable` na komórki kalendarza
4. **Magazyn** (`app/warehouse/page.tsx`)
   - Przeciągaj produkty między sekcjami (np. z `in-stock` do `out-of-stock`)
5. **Urządzenia** (`app/devices/page.tsx`)
   - Umożliw drag-and-drop grupowania urządzeń

### 3. Kroki implementacji
1. Zainstaluj pakiety:
```bash
npm install @atlaskit/pragmatic-drag-and-drop @atlaskit/pragmatic-drag-and-drop-react
```
2. Import w każdym module:
```tsx
import { DragDropProvider, Draggable, Droppable } from '@atlaskit/pragmatic-drag-and-drop-react';
import HTML5Backend from '@atlaskit/pragmatic-drag-and-drop-backend-html5';

function ModulePage() {
  return (
    <DragDropProvider backend={HTML5Backend}>
      {/* ... */}
    </DragDropProvider>
  );
}
```
3. Obuduj listy i kontenery komponentami `Draggable` i `Droppable`.

### 4. Testowanie i walidacja
- Testy jednostkowe (Jest): mockowanie backendu drag-and-drop
- Testy E2E (Cypress): symulacja drag-and-drop i sprawdzenie stanu

### 5. Troubleshooting
- Problemy z warstwą CSS? Ustaw `z-index` i `overflow` w Tailwind
- Błędy typu "Backend not found"? Upewnij się, że `HTML5Backend` jest importowany poprawnie

### 6. Podsumowanie
Implementacja Pragmatic Drag-and-Drop Atlassian podniesie interaktywność i umożliwi dynamiczne zarządzanie elementami UI w całym projekcie.
