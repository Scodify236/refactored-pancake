import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateAdmin } from '@/lib/api-helper';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateAdmin(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const card_id = (await params).id;
  try {
    const { name, inr_rate, usdt_rate } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Missing required variant name' }, { status: 400 });
    }

    const variant = await db.createVariant(card_id, name, inr_rate, usdt_rate);
    if (!variant) {
      return NextResponse.json({ error: 'Associated card not found' }, { status: 404 });
    }
    return NextResponse.json(variant, { status: 211 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to add variant' }, { status: 500 });
  }
}
