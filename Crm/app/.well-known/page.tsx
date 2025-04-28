// Endpoint for Microsoft domain verification
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  const filePath = path.join(process.cwd(), 'app', '.well-known', 'microsoft-identity-association.json');
  try {
    const file = await fs.readFile(filePath, 'utf-8');
    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    return new NextResponse('Not found', { status: 404 });
  }
}
