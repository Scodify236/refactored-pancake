import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateAdmin } from '@/lib/api-helper';

export async function GET() {
  try {
    const payouts = await db.getPayouts();
    return NextResponse.json(payouts);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to retrieve payouts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = authenticateAdmin(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { submission_date, payout_date, amount, card_type, method } = await req.json();
    if (!submission_date || !payout_date || !amount || !card_type || !method) {
      return NextResponse.json({ error: 'Missing required payout fields' }, { status: 400 });
    }

    const payout = await db.createPayout(submission_date, payout_date, amount, card_type, method, 'Completed');
    return NextResponse.json(payout, { status: 211 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save payout record' }, { status: 500 });
  }
}
