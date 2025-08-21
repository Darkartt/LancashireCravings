import { NextResponse } from 'next/server';
import { processContact } from './contact-logic';

// Route handler using the pure function
export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const jsonBody = await req.json().catch(() => null);
    const result = processContact(jsonBody, ip);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

// In static export environments (e.g., GitHub Pages) dynamic routes are not supported.
// Mark this route as static so the exporter doesn't fail the build.
export const dynamic = 'force-static';
export const revalidate = false;
