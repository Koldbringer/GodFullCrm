# Plan integracji Fumadocs dla dynamicznych ofert i raportów

## Cel
Wykorzystanie Fumadocs do tworzenia atrakcyjnych, dynamicznie generowanych ofert i raportów dla klientów w systemie CRM/ERP. Zamiast generowania statycznych plików PDF, będziemy tworzyć dedykowane strony dostępne poprzez unikalne linki.

## Technologie
- Next.js (istniejący projekt w `Crm/`)
- Fumadocs (do instalacji i konfiguracji)
- Supabase (do przechowywania danych ofert/raportów i zarządzania dostępem przez tokeny)

## Plan implementacji

1.  **Instalacja Fumadocs:**
    *   Użycie `npm create fumadocs-app` w katalogu `Crm/` w celu zainicjowania struktury Fumadocs.
    *   Konfiguracja Fumadocs w projekcie Next.js, dostosowanie ścieżek i ustawień.

2.  **Struktura danych w Supabase:**
    *   Utworzenie tabeli w Supabase do przechowywania danych ofert/raportów (np. `client_documents`).
    *   Tabela powinna zawierać pola takie jak: `id`, `client_id`, `document_type` (oferta/raport), `data` (JSON z danymi do dynamicznego wypełnienia), `access_token` (unikalny token do dostępu), `expires_at` (data wygaśnięcia tokenu).

3.  **Generowanie dynamicznych stron:**
    *   Stworzenie dynamicznej trasy w Next.js (np. `app/documents/[token]/page.tsx`) do obsługi linków z tokenami.
    *   Na tej stronie, pobranie danych oferty/raportu z Supabase na podstawie tokenu dostępu.
    *   Walidacja tokenu (sprawdzenie istnienia i daty wygaśnięcia).
    *   Wykorzystanie komponentów Fumadocs do renderowania treści oferty/raportu na podstawie pobranych danych.

4.  **Tworzenie szablonów Fumadocs:**
    *   Zdefiniowanie szablonów dla różnych typów dokumentów (ofert, raportów) przy użyciu składni MDX i komponentów Fumadocs.
    *   Szablony będą zawierać placeholder'y, które zostaną dynamicznie wypełnione danymi z Supabase.

5.  **Generowanie linków dostępu:**
    *   Implementacja funkcji w backendzie (np. w API route lub Edge Function Supabase) do generowania unikalnych tokenów dostępu i zapisywania ich w tabeli `client_documents` wraz z danymi i datą wygaśnięcia.
    *   Generowanie pełnego URL do dynamicznej strony z tokenem.

6.  **Integracja z UI CRM:**
    *   Dodanie interfejsu w panelu CRM do tworzenia nowych ofert/raportów dla klientów.
    *   Umożliwienie wyboru szablonu, wprowadzenia danych i wygenerowania linku.
    *   Dodanie opcji wysyłki linku do klienta (np. przez email).

7.  **Zabezpieczenia:**
    *   Implementacja Row Level Security (RLS) w Supabase dla tabeli `client_documents`, aby dostęp był możliwy tylko z poprawnym tokenem.
    *   Zapewnienie, że tokeny są unikalne i mają ograniczony czas ważności.

## Kolejne kroki
- Utworzenie struktury Fumadocs w projekcie `Crm/`.
- Zdefiniowanie początkowej struktury tabeli `client_documents` w Supabase.
- Implementacja dynamicznej trasy `app/documents/[token]/page.tsx`.
- Stworzenie prostego szablonu oferty w Fumadocs.
- Implementacja funkcji generowania tokenów i linków.

## Testowanie
- Testowanie generowania linków i dostępu do stron.
- Testowanie poprawności renderowania danych w szablonach.
- Testowanie zabezpieczeń (RLS, wygaśnięcie tokenu).

## Dokumentacja
- Aktualizacja `memory-bank/progress.md` o postępy.
- Dodanie dokumentacji technicznej Fumadocs i procesu generowania dokumentów w katalogu `Crm/docs/`.
