# Wdrożenie GodLike CRM na Coolify

## Szybki start

1. Sklonuj repozytorium na swój serwer lub połącz Coolify z repozytorium GitHub
2. Upewnij się, że masz skonfigurowane zmienne środowiskowe w panelu Coolify
3. Wdróż aplikację za pomocą panelu Coolify

## Wymagane zmienne środowiskowe

```
NEXT_PUBLIC_SUPABASE_URL=https://acfyvozuelayjdhmdtky.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZnl2b3p1ZWxheWpkaG1kdGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDQwNTcsImV4cCI6MjA2MDU4MDA1N30.G3S7w0L4pFXDBUtwxBz660MfG0PJt1Esyb2GZf1l_bw
NEXT_PUBLIC_DISABLE_SUPABASE_AUTH=false
NEXT_PUBLIC_BASE_URL=https://twoja-domena.pl
NODE_ENV=production
```

## Sprawdzenie statusu aplikacji

Po wdrożeniu, możesz sprawdzić status aplikacji pod adresem:

```
https://twoja-domena.pl/api/health
```

## Szczegółowa dokumentacja

Pełna dokumentacja wdrożenia znajduje się w pliku [DEPLOYMENT.md](./DEPLOYMENT.md).
