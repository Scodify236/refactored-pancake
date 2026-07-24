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
    const { name, inr_rate, usdt_rate } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Missing required variant name' }, { status: 400 });
    }

    const variant = await db.updateVariant(id, name, inr_rate, usdt_rate);
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }
    return NextResponse.json(variant);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update variant' }, { status: 500 });
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
    const variant = await db.deleteVariant(id);
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Variant deleted successfully', variant });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete variant' }, { status: 500 });
  }
}
