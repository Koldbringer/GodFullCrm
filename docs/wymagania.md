# GodFullCrm - Wymagania Systemu Zarządzania dla Firm HVAC

## Przegląd
GodFullCrm to kompleksowy system CRM/ERP zaprojektowany specjalnie dla firm HVAC na polskim rynku. System ma na celu usprawnienie wszystkich aspektów działalności biznesowej HVAC, od pozyskiwania klientów po dostarczanie usług i fakturowanie.

## Główne Funkcje

### 1. Zarządzanie Procesem Obsługi Klienta
- **Tablica Kanban**: Śledzenie statusu klienta od pierwszego kontaktu do zakończenia projektu
- **Zbieranie Danych Klienta**: System formularzy po wstępnej rozmowie
- **Śledzenie Leadów**: Kompleksowy system zarządzania potencjalnymi klientami w lejku sprzedażowym

### 2. System Kalendarza i Planowania
- **Wielofunkcyjny Kalendarz**: Zarządzanie trzema różnymi typami spotkań:
  - Oględziny nieruchomości
  - Montaże urządzeń
  - Wizyty serwisowe/konserwacyjne
- **Optymalizacja Zasobów**: Minimalizacja pracy biurowej poprzez efektywne planowanie
- **Zarządzanie Dostępnością**: Wyświetlanie dostępnych terminów dla klientów

### 3. Dynamiczne Generowanie Ofert
- **Oferty Internetowe**: Generowanie dynamicznych stron internetowych zamiast statycznych PDF-ów
- **Wiele Propozycji**: Przedstawianie 3-4 opcji urządzeń dla każdego klienta
- **Wycena Komponentowa**: Standardowe opisy i zdjęcia z zmienną wyceną
- **Wycena Wspomagana AI**: Wstępna wycena generowana przez LLM na podstawie:
  - Liczby urządzeń
  - Długości instalacji
  - Dodatkowych instalacji
  - Pompek skroplin
  - Usług wkuwania w ścianę
  - Innych zmiennych
- **System Zatwierdzania przez Menedżera**: Aplikacja mobilna dla menedżerów do przeglądania i dostosowywania cen
- **Interakcja z Klientem**: Profesjonalny interfejs dla klientów do przeglądania i zatwierdzania ofert

### 4. Zarządzanie Rozmowami i Transkrypcja
- **Transkrypcja Rozmów**: Automatyczna transkrypcja rozmów z klientami
- **Analiza AI**: Wyodrębnianie kluczowych informacji z transkrypcji rozmów
- **Przygotowanie Oferty**: Generowanie wstępnych ofert na podstawie treści rozmowy

### 5. Zarządzanie Serwisem
- **Katalog Instalacji**: Wykaz urządzeń bez cen z dostępnymi terminami
- **Dynamiczne Oferty Serwisowe**: Generowanie ofert na podstawie:
  - Liczby urządzeń
  - Złożoności pracy
  - Lokalizacji
- **Profesjonalny UI/UX**: Angażujące animacje i wizualna informacja zwrotna podczas zatwierdzania oferty
- **Raportowanie Serwisowe**: Elektroniczny system dla techników do generowania raportów zawierających:
  - Listy kontrolne
  - Notatki/wpisy
  - Zdjęcia
  - System dostarczania raportów klientom

### 6. Fakturowanie i Zarządzanie Finansami
- **Integracja Faktur**: System do obsługi generowania i śledzenia faktur
- **Analiza OCR**: Wyodrębnianie danych z faktur PDF
- **Śledzenie Płatności**: System monitorowania płatności poprzez integrację z bankiem Santander

## Wymagania Techniczne

### Frontend
- Responsywny interfejs oparty na Next.js
- Projekt przyjazny dla urządzeń mobilnych dla techników terenowych
- Specjalna aplikacja mobilna dla menedżerów

### Backend
- Bezpieczne punkty końcowe API
- Integracja bazy danych dla danych klientów i usług
- Integracja AI do transkrypcji i wyceny

### Wdrożenie
- Konteneryzacja Docker
- Konfiguracja wdrożenia Coolify
- Skalowalna architektura

## Punkty Integracji
- System bankowy (Santander)
- Istniejące oprogramowanie do fakturowania
- Systemy kalendarza
- Narzędzia komunikacyjne

## Wymagania Bezpieczeństwa
- Bezpieczne przechowywanie danych klientów
- Kontrola dostępu oparta na rolach
- Rejestrowanie audytu dla wrażliwych operacji