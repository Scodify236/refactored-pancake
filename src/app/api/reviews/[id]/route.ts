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
    const { name, role, avatar_url, quote, rating, trade_type, proof_image_url, region, gc_received_date, payment_sent_date, amount, amount_label } = await req.json();

    if (!name || !quote || !trade_type || !proof_image_url) {
      return NextResponse.json({ error: 'Missing required fields for update' }, { status: 400 });
    }

    const computedLabel = amount_label || (amount >= 50000 ? '₹50k+' : amount >= 25000 ? '₹25k+' : amount >= 10000 ? '₹10k+' : amount >= 5000 ? '₹5k+' : '');
    const review = await db.updateReview(id, name, role, avatar_url, quote, rating, trade_type, proof_image_url, region, gc_received_date, payment_sent_date, amount || 0, computedLabel);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json(review);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
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
    const review = await db.deleteReview(id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Review deleted successfully', review });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
