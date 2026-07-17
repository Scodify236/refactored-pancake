import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateAdmin } from '@/lib/api-helper';

export async function POST(req: Request) {
  const auth = authenticateAdmin(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { payouts } = await req.json();
    if (!payouts || !Array.isArray(payouts) || payouts.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty batch payouts payload' }, { status: 400 });
    }

    const inserted = await db.createPayoutsBatch(payouts);
    return NextResponse.json({ message: 'Batch payouts inserted successfully', count: inserted.length, payouts: inserted }, { status: 211 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to batch insert payouts', details: err.message }, { status: 500 });
  }
}
