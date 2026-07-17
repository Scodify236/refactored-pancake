import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reviews = await db.getReviews();
    return NextResponse.json(reviews);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to retrieve reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, role, avatar_url, quote, rating, trade_type, proof_image_url, region, gc_received_date, payment_sent_date, amount, amount_label } = await req.json();

    if (!name || !quote || !trade_type || !proof_image_url) {
      return NextResponse.json({ error: 'Missing required fields. Note: Name, Review, Trade Type, and Proof Image are mandatory.' }, { status: 400 });
    }

    const computedLabel = amount_label || (amount >= 50000 ? '₹50k+' : amount >= 25000 ? '₹25k+' : amount >= 10000 ? '₹10k+' : amount >= 5000 ? '₹5k+' : '');
    const review = await db.createReview(name, role, avatar_url, quote, rating, trade_type, proof_image_url, region, gc_received_date, payment_sent_date, amount || 0, computedLabel);
    return NextResponse.json(review, { status: 211 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
