# HVAC CRM ERP System

System zarządzania relacjami z klientami (CRM) i planowania zasobów przedsiębiorstwa (ERP) dla firm z branży HVAC (ogrzewanie, wentylacja i klimatyzacja).

## Opis projektu

HVAC CRM ERP to kompleksowe rozwiązanie do zarządzania procesami biznesowymi w firmach zajmujących się instalacją, serwisem i konserwacją systemów HVAC. System umożliwia zarządzanie klientami, lokalizacjami, urządzeniami, zleceniami serwisowymi, technikami, magazynem, fakturami i innymi aspektami działalności firmy HVAC.

## Technologie

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Vercel

## Struktura projektu

```
Crm/
├── app/                  # Strony aplikacji (Next.js App Router)
├── components/           # Komponenty React
├── lib/                  # Biblioteki i funkcje pomocnicze
├── public/               # Pliki statyczne
├── styles/               # Style CSS
├── types/                # Definicje typów TypeScript
└── docs/                 # Dokumentacja
```

## Integracja z Supabase

System korzysta z Supabase jako backendu, co zapewnia:

- Relacyjną bazę danych PostgreSQL
- API REST dla operacji CRUD
- Możliwość rozszerzenia o autentykację i autoryzację
- Skalowalność i wydajność

### Struktura bazy danych

#### Tabele podstawowe
1. **customers** - Klienci
2. **sites** - Lokalizacje
3. **devices** - Urządzenia
4. **service_orders** - Zlecenia serwisowe
5. **technicians** - Technicy
6. **inventory_items** - Elementy magazynowe
7. **service_reports** - Raporty serwisowe
8. **device_telemetry** - Dane telemetryczne urządzeń
9. **notifications** - Powiadomienia

#### Tabele rozszerzone
10. **customer_contacts** - Kontakty klientów
11. **maintenance_schedules** - Harmonogramy konserwacji
12. **inventory_transactions** - Transakcje magazynowe
13. **device_documents** - Dokumenty urządzeń
14. **invoices** - Faktury
15. **warranty_claims** - Zgłoszenia gwarancyjne
16. **technician_schedules** - Harmonogramy techników
17. **device_parts** - Części urządzeń

### Relacje między tabelami

System wykorzystuje zaawansowane relacje między tabelami, co pozwala na efektywne zarządzanie danymi i zapewnia integralność referencyjną. Przykładowe relacje:

- Klienci mają wiele lokalizacji
- Lokalizacje mają wiele urządzeń
- Urządzenia mają wiele zleceń serwisowych
- Urządzenia mają wiele danych telemetrycznych
- Klienci mają wiele kontaktów
- Urządzenia mają wiele harmonogramów konserwacji
- Urządzenia mają wiele dokumentów
- Klienci mają wiele faktur
- Urządzenia mają wiele zgłoszeń gwarancyjnych
- Technicy mają wiele wpisów w harmonogramie

## Funkcjonalności

### Zaimplementowane
- Zarządzanie urządzeniami HVAC
- Zarządzanie zleceniami serwisowymi
- Zarządzanie technikami
- System powiadomień

### Planowane
- Zarządzanie klientami i kontaktami
- Zarządzanie lokalizacjami
- Zarządzanie magazynem i transakcjami
- Zarządzanie raportami serwisowymi
- Telemetria urządzeń i wizualizacja danych
- Dashboard z kluczowymi wskaźnikami
- Fakturowanie
- Obsługa zgłoszeń gwarancyjnych
- Harmonogramy konserwacji
- Harmonogramy pracy techników
- Zarządzanie częściami urządzeń

## Instalacja i uruchomienie

### Wymagania
- Node.js 18+
- npm lub yarn
- Konto Supabase

### Instalacja
1. Sklonuj repozytorium
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj zmienne środowiskowe w pliku `.env.local`
4. Uruchom aplikację w trybie deweloperskim: `npm run dev`

### Zmienne środowiskowe
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Dokumentacja

Szczegółowa dokumentacja projektu znajduje się w katalogu `docs/`:
- [Plan wdrożenia integracji z Supabase](./docs/supabase-integration-plan.md)

## Licencja

Projekt jest własnością firmy i podlega ochronie prawnej. Wszelkie prawa zastrzeżone.
