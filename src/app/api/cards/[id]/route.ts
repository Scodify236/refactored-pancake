import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateAdmin } from '@/lib/api-helper';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateAdmin(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  try {
    const { name, img, tag, glow } = await req.json();
    if (!name || !img || !tag || !glow) {
      return NextResponse.json({ error: 'Missing required card fields' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Update card not implemented' }, { status: 501 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateAdmin(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  try {
    const card = await db.deleteCard(id);
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Card deleted successfully', card });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
