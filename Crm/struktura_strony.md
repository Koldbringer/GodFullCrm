# Struktura strony CRM i przygotowanie do dalszego rozwoju

## 1. Architektura katalogów

```
Crm/
├─ app/                   # Next.js App Router
│  ├─ layout.tsx          # Główny layout (header, sidebar)
│  ├─ loading.tsx         # Globalny loading state
│  ├─ page.tsx            # Dashboard (strona główna)
│  ├─ mobile/             # Specjalny layout dla urządzeń mobilnych
│  │  └─ page.tsx
│  ├─ calendar/           # Moduł kalendarza
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ customers/          # Moduł klientów
│  │  ├─ layout.tsx
│  │  ├─ list/page.tsx
│  │  └─ [id]/page.tsx
│  ├─ contracts/          # Umowy (kontrakty)
│  ├─ devices/            # Urządzenia
│  ├─ employees/          # Pracownicy
│  ├─ inventory/          # Magazyn
│  ├─ service-orders/     # Zlecenia serwisowe
│  ├─ sites/              # Lokacje
│  └─ tickets/            # Zgłoszenia serwisowe
├─ components/            # Globalne komponenty UI
├─ hooks/                 # Custom hooks (fetch, auth)
├─ lib/                   # Biblioteki pomocnicze (utils)
├─ public/                # Statyczne zasoby (obrazy, logo)
├─ styles/                # Style globalne i zmienne Tailwind
├─ next.config.mjs        # Konfiguracja Next.js
├─ tailwind.config.ts     # Konfiguracja Tailwind CSS
├─ package.json           # Zależności i skrypty
└─ tsconfig.json          # TypeScript config
```

## 2. Routing i nawigacja
- **Główna nawigacja** w `layout.tsx`: sidebar + header
- **Nested routes** w `app/<moduł>/layout.tsx` dla spójnego interfejsu
- **Dynamic routes**: `app/customers/[id]/page.tsx`

## 3. Przygotowanie do rozwoju

1. **Zarządzanie stanem**: skonfigurować React Query lub Zustand dla globalnych danych
2. **API layer**: utworzyć `lib/api.ts` z klientem Supabase
3. **Type safety**: wygenerować typy z Supabase (mcp6_generate_typescript_types)
4. **Autoryzacja**: dodać middleware/auth guard w `layout.tsx`
5. **Komponenty atomowe**: stworzyć katalog `components/atoms`, `molecules`, `organisms`
6. **Storybook**: zainstalować i skonfigurować, by dokumentować UI
7. **Testy**: dodać folder `__tests__` obok modułów, skonfigurować ESLint + Prettier
8. **Internationalization**: extension Next i18n (pl, en)
9. **CI/CD**: skonfigurować GitHub Actions (build, lint, test)
10. **Monitorowanie**: dodać Sentry lub LogRocket

## 4. Kolejne kroki
- Utworzyć klienta Supabase i skonfigurować połączenie w `lib/supabaseClient.ts`
- Wygenerować tabele i zapytania CRUD dla modułów (customers, orders)
- Zaimplementować layout responsywny i dark mode
- Przygotować i wdrożyć testy E2E dla najważniejszych ścieżek użytkownika
- Uruchomić Storybook: `npm run storybook`

## 5. Wizjonerskie rozszerzenia interfejsu

- **Panel asystenta AI** – globalny dostęp do AI (chat, sugestie, automatyzacje, generowanie raportów, predykcje)
- **Dynamiczne powiadomienia** – kontekstowe, inteligentne, nieinwazyjne
- **Panel szybkiego dostępu** – konfigurowalne skróty do najczęstszych akcji/modułów
- **Widżety analityczne** – dashboard z KPI, alertami, predykcjami AI
- **Integracje z komunikatorami** – szybkie odpowiedzi, powiadomienia push
- **Tryb offline/PWA** – praca bez internetu, synchronizacja po odzyskaniu połączenia
- **Zaawansowane filtry i wyszukiwarka** – AI search, filtrowanie kontekstowe
- **Personalizacja UI** – zmiana układu, motywu, skrótów, języka
- **Panel powiadomień i zadań** – wszystko w jednym miejscu, integracja z kalendarzem

---

*Te rozszerzenia nadają interfejsowi wymiar przyszłościowy i praktyczny, odpowiadając na realne potrzeby użytkowników biznesowych.*

*Dokumentacja struktury i plan działania gotowa do rozwoju modułów ERP.*
