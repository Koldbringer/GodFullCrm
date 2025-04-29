import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// POST: zapisuje plik MDX do katalogu kombajn/content/docs
export async function POST(req: Request) {
  try {
    const { filename, content } = await req.json();
    if (!filename || !content) {
      return NextResponse.json({ error: 'Brak wymaganych danych' }, { status: 400 });
    }
    const docsDir = path.resolve(process.cwd(), '../../kombajn/content/docs');
    const filePath = path.join(docsDir, `${filename}.mdx`);
    fs.writeFileSync(filePath, content, 'utf8');
    return NextResponse.json({ success: true, url: `/docs/${filename}` });
  } catch (error) {
    console.error('Błąd zapisu oferty:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
