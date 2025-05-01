import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { createOffer } from "@/lib/api/offers";
import fs from 'fs';
import path from 'path';

// POST: tworzy nową ofertę w bazie danych lub zapisuje plik MDX
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Sprawdź, czy to żądanie tworzenia oferty w bazie danych
    if (data.customer_id && data.options) {
      // Validate required fields
      if (!data.title || data.options.length === 0) {
        return NextResponse.json(
          { message: "Brakuje wymaganych pól" },
          { status: 400 }
        );
      }

      // Create offer
      const token = await createOffer(data);
      return NextResponse.json({ token });
    }
    // Stara funkcjonalność - zapisywanie pliku MDX
    else if (data.filename && data.content) {
      const docsDir = path.resolve(process.cwd(), '../../kombajn/content/docs');
      const filePath = path.join(docsDir, `${data.filename}.mdx`);
      fs.writeFileSync(filePath, data.content, 'utf8');
      return NextResponse.json({ success: true, url: `/docs/${data.filename}` });
    } else {
      return NextResponse.json({ error: 'Brak wymaganych danych' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in offers API:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Wystąpił błąd podczas przetwarzania żądania" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(cookies());
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customer_id");

    let query = supabase
      .from("offers")
      .select(`
        id,
        title,
        status,
        created_at,
        valid_until,
        token,
        customers (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (customerId) {
      query = query.eq("customer_id", customerId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania ofert" },
      { status: 500 }
    );
  }
}
