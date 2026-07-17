import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { authStore } from '@/lib/auth-store';

export async function POST(req: Request) {
  try {
    const { otp } = await req.json();

    if (!otp) {
      return NextResponse.json({ error: 'OTP code is required.' }, { status: 400 });
    }

    const currentOtp = authStore.getOtp();
    if (!currentOtp || currentOtp.code !== otp.trim() || Date.now() > currentOtp.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 401 });
    }

    // Clear verified OTP
    authStore.setOtp(null);

    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = Date.now() + 3600000; // 1 hour session

    authStore.getSessions().set(token, {
      email: 'veltrix620@gmail.com',
      expiresAt
    });

    return NextResponse.json({
      success: true,
      token,
      expiresAt
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400 });
  }
}
