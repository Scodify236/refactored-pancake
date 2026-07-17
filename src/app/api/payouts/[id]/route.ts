import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateAdmin } from '@/lib/api-helper';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateAdmin(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  try {
    const { submission_date, payout_date, amount, card_type, method } = await req.json();
    if (!submission_date || !payout_date || !amount || !card_type || !method) {
      return NextResponse.json({ error: 'Missing required payout fields' }, { status: 400 });
    }

    const payout = await db.updatePayout(id, submission_date, payout_date, amount, card_type, method, 'Completed');
    if (!payout) {
      return NextResponse.json({ error: 'Payout record not found' }, { status: 404 });
    }
    return NextResponse.json(payout);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update payout' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateAdmin(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  try {
    const payout = await db.deletePayout(id);
    if (!payout) {
      return NextResponse.json({ error: 'Payout record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Payout record deleted successfully', payout });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete payout' }, { status: 500 });
  }
}
