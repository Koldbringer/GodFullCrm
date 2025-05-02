# Instrukcja wdrożenia GodLike CRM na Coolify

Ten dokument zawiera instrukcje dotyczące wdrożenia aplikacji GodLike CRM na platformie Coolify.

## Wymagania

- Serwer VPS z zainstalowanym Coolify
- Dostęp do repozytorium kodu (GitHub, GitLab, itp.)
- Konto Supabase z skonfigurowaną bazą danych

## Krok 1: Przygotowanie projektu

Upewnij się, że projekt zawiera następujące pliki:

- `Dockerfile` - definicja obrazu kontenera
- `docker-compose.yaml` - konfiguracja usługi
- `.env.production` - zmienne środowiskowe dla produkcji

## Krok 2: Konfiguracja Coolify

1. Zaloguj się do panelu Coolify na swoim VPS
2. Utwórz nowy projekt (np. "GodLike CRM")
3. Dodaj nową usługę, wybierając opcję "Docker Compose"
4. Podłącz repozytorium kodu (GitHub, GitLab, itp.)
5. Wskaż ścieżkę do pliku `docker-compose.yaml` (domyślnie w katalogu głównym)

## Krok 3: Konfiguracja zmiennych środowiskowych

W panelu Coolify, dodaj następujące zmienne środowiskowe:

```
NEXT_PUBLIC_SUPABASE_URL=https://acfyvozuelayjdhmdtky.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZnl2b3p1ZWxheWpkaG1kdGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDQwNTcsImV4cCI6MjA2MDU4MDA1N30.G3S7w0L4pFXDBUtwxBz660MfG0PJt1Esyb2GZf1l_bw
NEXT_PUBLIC_DISABLE_SUPABASE_AUTH=false
NEXT_PUBLIC_BASE_URL=https://twoja-domena.pl
NODE_ENV=production
```

Jeśli używasz dodatkowych usług, dodaj również ich klucze API:

```
NEXT_PUBLIC_ELEVEN_LABS_API_KEY=twój-klucz-api
NEXT_PUBLIC_OPENROUTER_API_KEY=twój-klucz-api
```

## Krok 4: Konfiguracja domeny

1. W panelu Coolify, przejdź do ustawień usługi
2. Dodaj domenę (np. crm.twoja-firma.pl)
3. Skonfiguruj certyfikat SSL (Coolify może automatycznie wygenerować certyfikat Let's Encrypt)

## Krok 5: Wdrożenie

1. Kliknij przycisk "Deploy" w panelu Coolify
2. Poczekaj na zakończenie procesu budowania i wdrażania
3. Sprawdź logi, aby upewnić się, że wszystko działa poprawnie

## Krok 6: Weryfikacja

1. Otwórz przeglądarkę i przejdź do skonfigurowanej domeny
2. Sprawdź, czy aplikacja działa poprawnie
3. Sprawdź, czy połączenie z Supabase jest aktywne (endpoint `/api/health` powinien zwrócić status "healthy")

## Rozwiązywanie problemów

### Problem z połączeniem do Supabase

Jeśli aplikacja nie może połączyć się z Supabase:

1. Sprawdź, czy zmienne środowiskowe są poprawnie ustawione
2. Sprawdź, czy adres URL i klucz Supabase są prawidłowe
3. Sprawdź, czy tabele w Supabase są poprawnie skonfigurowane

### Problem z certyfikatem SSL

Jeśli występują problemy z certyfikatem SSL:

1. Upewnij się, że rekordy DNS są poprawnie skonfigurowane
2. Spróbuj ponownie wygenerować certyfikat w panelu Coolify
3. Sprawdź, czy domena jest poprawnie przypisana do usługi

### Problemy z wydajnością

Jeśli aplikacja działa wolno:

1. Zwiększ zasoby przydzielone do usługi w panelu Coolify
2. Sprawdź, czy indeksy w bazie danych są poprawnie skonfigurowane
3. Rozważ włączenie cache'owania dla często używanych zapytań

## Aktualizacje

Aby zaktualizować aplikację:

1. Wypchnij zmiany do repozytorium kodu
2. W panelu Coolify, kliknij "Redeploy" dla usługi
3. Poczekaj na zakończenie procesu aktualizacji

## Kopie zapasowe

Coolify nie tworzy automatycznie kopii zapasowych danych aplikacji. Zaleca się:

1. Regularne tworzenie kopii zapasowych bazy danych Supabase
2. Konfigurację automatycznych kopii zapasowych na poziomie VPS
3. Eksportowanie ważnych danych za pomocą narzędzi Supabase

## Monitorowanie

Coolify oferuje podstawowe monitorowanie usług. Dla bardziej zaawansowanego monitorowania, rozważ:

1. Integrację z narzędziami takimi jak Prometheus i Grafana
2. Konfigurację alertów dla kluczowych metryk
3. Implementację logowania zdarzeń do zewnętrznego systemu
