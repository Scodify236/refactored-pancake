import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { otp } = await req.json();

    if (!otp) {
      return NextResponse.json({ error: 'OTP code is required.' }, { status: 400 });
    }

    const currentOtp = await db.getOtp();
    if (!currentOtp || currentOtp.code !== otp.trim() || Date.now() > currentOtp.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 401 });
    }

    // Clear verified OTP
    await db.setOtp(null);

    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = Date.now() + 3600000; // 1 hour session

    await db.createSession(token, 'veltrix620@gmail.com', expiresAt);

    return NextResponse.json({
      success: true,
      token,
      expiresAt
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400 });
  }
}
