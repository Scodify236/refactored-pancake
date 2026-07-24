import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateAdmin } from '@/lib/api-helper';

export async function GET() {
  try {
    const cards = await db.getCards();
    return NextResponse.json(cards);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { name, img, tag, glow } = await req.json();
    if (!name || !img || !tag || !glow) {
      return NextResponse.json({ error: 'Missing required card fields' }, { status: 400 });
    }

    const card = await db.createCard(name, img, tag, glow);
    return NextResponse.json(card, { status: 211 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
