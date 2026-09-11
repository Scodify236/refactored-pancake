import { NextResponse } from 'next/server';
import { parseUserAgent } from '@/lib/api-helper';
import { db } from '@/lib/db';

const WORKER_URL = "https://plain-truth-ef5e.veltrix620.workers.dev/send";
const SENDER_EMAIL = "GCX Staff Security <auth@kouzu.in>";

export async function POST(req: Request) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await db.setOtp({ code: otp, expiresAt: Date.now() + 3600000 }); // Valid for 1 hour

  console.log("-----------------------------------------");
  console.log(`[AUTH] Generated OTP: ${otp} (Expires: ${new Date(Date.now() + 3600000).toLocaleTimeString()})`);
  console.log("-----------------------------------------");

  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const clientIp = typeof ip === 'string' ? ip.split(',')[0].trim() : ip;
  const uaString = req.headers.get('user-agent') || '';
  const userAgentInfo = parseUserAgent(uaString);
  const timestamp = new Date().toUTCString();

  try {
    const basePayload = {
      from: SENDER_EMAIL,
      subject: 'GCX Staff OTP',
      text: `Your GCX admin OTP is: ${otp}\n\nRequested: ${timestamp}\nIP: ${clientIp}\nBrowser: ${userAgentInfo.browser} on ${userAgentInfo.os}\n\nExpires in 1 hour. Do not share.`,
    };

    const recipients = ['veltrix620@gmail.com', 'shirtlessdigital@gmail.com'];

    // Send via Cloudflare Worker (confirmed working) — one request per recipient
    const sendPromises = recipients.map(async (email) => {
      try {
        const res = await fetch(WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...basePayload,
            to: [email],
          }),
        });
        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }
        console.log(`[AUTH] Worker response for ${email}:`, res.status, data);
        return { email, success: res.ok, status: res.status, data };
      } catch (err: any) {
        console.error(`[AUTH] Worker fetch error for ${email}:`, err.message);
        return { email, success: false, error: err.message };
      }
    });

    const results = await Promise.all(sendPromises);
    const allSuccessful = results.every(r => r.success);

    return NextResponse.json({
      success: allSuccessful,
      message: 'OTP sent to veltrix620@gmail.com and shirtlessdigital@gmail.com.',
      raw: results
    }, { status: allSuccessful ? 200 : 207 });
  } catch (err: any) {
    console.error("Failed to deliver OTP email:", err);
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to send OTP.',
      raw: err?.raw || null
    }, { status: 500 });
  }
}
