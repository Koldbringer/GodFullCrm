import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Pobieranie ustawień bezpieczeństwa z tabeli app_settings
  const { data, error } = await supabase
    .from('app_settings')
    .select('two_factor_auth_enabled, gdpr_compliance_settings, vulnerability_scanning_schedule')
    .single(); // Zakładamy, że jest tylko jeden wiersz z ustawieniami globalnymi

  if (error) {
    // Jeśli nie ma wiersza z ustawieniami, zwróć domyślne lub pusty obiekt
    if (error.code === 'PGRST116') { // Kod błędu dla braku wiersza
       return NextResponse.json({
        two_factor_auth_enabled: false,
        gdpr_compliance_settings: {},
        vulnerability_scanning_schedule: {}
       });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const settingsToUpdate = await request.json();

  // Aktualizacja tylko pól związanych z bezpieczeństwem w tabeli app_settings
  // Zakładamy, że istnieje już wiersz z ustawieniami globalnymi (utworzony np. przy pierwszym uruchomieniu)
  const { data, error } = await supabase
    .from('app_settings')
    .update({
      two_factor_auth_enabled: settingsToUpdate.two_factor_auth_enabled,
      gdpr_compliance_settings: settingsToUpdate.gdpr_compliance_settings,
      vulnerability_scanning_schedule: settingsToUpdate.vulnerability_scanning_schedule,
      updated_at: new Date().toISOString() // Aktualizacja timestampu
    })
    .select('two_factor_auth_enabled, gdpr_compliance_settings, vulnerability_scanning_schedule')
    .single(); // Zakładamy, że aktualizujemy jedyny wiersz z ustawieniami globalnymi

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Operacje POST i DELETE dla ustawień bezpieczeństwa nie są typowe,
// ponieważ są one częścią globalnych ustawień aplikacji.
// Jeśli potrzebne są specyficzne operacje, można je dodać tutaj.
// export async function POST(request: Request) { ... }
// export async function DELETE(request: Request) { ... }