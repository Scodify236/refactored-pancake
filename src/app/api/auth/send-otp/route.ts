import { NextResponse } from 'next/server';
import { parseUserAgent, getMailTransporter } from '@/lib/api-helper';
import { db } from '@/lib/db';

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
    const transporter = await getMailTransporter();
    if (!transporter) {
      return NextResponse.json({ success: true, message: 'OTP logged to terminal console (SMTP/Ethereal Offline).' });
    }

    const mailOptions = {
      from: '"GCX Security Operations" <giftcardexchange.gcx@gmail.com>',
      to: 'veltrix620@gmail.com, shirtlessdigital@gmail.com',
      subject: 'GCX Staff Verification Access Code',
      text: `Your verification passcode is: ${otp}. It was requested on ${timestamp} from IP ${clientIp} using ${userAgentInfo.browser} on ${userAgentInfo.os}.`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GCX Staff Verification Access Code</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Unbounded:wght@700;900&family=Space+Mono:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #09090a; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; color: #e4e4e7;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; width: 100%; background: #121214; border-radius: 24px; border: 1px solid rgba(240, 203, 135, 0.12); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); overflow: hidden;">

          <!-- Content Wrapper -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              
              <!-- Greeting & Header -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="left" style="font-family: 'Unbounded', 'Plus Jakarta Sans', -apple-system, sans-serif; color: #f0cb87; font-size: 20px; font-weight: 700; padding-bottom: 12px;">
                    Staff Authorization
                  </td>
                </tr>
                <tr>
                  <td align="left" style="color: #a1a1aa; font-size: 14px; line-height: 1.6; font-weight: 400;">
                    A secure authentication request was detected for the <strong style="color: #f4f4f5;">GCX Administrative Console</strong>. Please verify your identity by entering the one-time passcode (OTP) displayed below:
                  </td>
                </tr>
              </table>

              <!-- OTP Code Display Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #16161a; border: 1px solid rgba(240, 203, 135, 0.15); border-radius: 16px; margin-bottom: 28px;">
                <tr>
                  <td align="center" style="padding: 24px 20px;">
                    <div style="font-family: 'Space Mono', 'Courier New', Courier, monospace; font-size: 44px; font-weight: 700; letter-spacing: 12px; color: #f0cb87; margin-left: 12px; line-height: 1;">
                      ${otp}
                    </div>
                    <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 2px; margin-top: 10px;">
                      One-Time Passcode
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="http://localhost:3000/internal/staff/admin" target="_blank" style="display: inline-block; padding: 12px 32px; background-color: #f0cb87; border: 1px solid #f0cb87; border-radius: 9999px; color: #0b0b0c; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; transition: all 0.3s ease;">
                      Launch Administrative Console
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Metadata Log Details -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="left" style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 10px;">
                    Security Log Info
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="background-color: #16161a; border: 1px solid rgba(240, 203, 135, 0.08); border-radius: 12px; font-size: 13px; color: #a1a1aa;">
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600; width: 140px;">IP Address</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5; font-family: 'Space Mono', monospace; font-weight: bold;">${clientIp}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600;">Operating System</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5;">${userAgentInfo.os}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600;">Browser</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5;">${userAgentInfo.browser}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; font-weight: 600;">Timestamp</td>
                        <td style="padding: 8px 12px; color: #f4f4f5; font-family: 'Space Mono', monospace; font-size: 12px;">${timestamp}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Alert Notice -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="12" style="background-color: rgba(239, 68, 68, 0.04); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 12px;">
                      <tr>
                        <td align="left" style="color: #ef4444; font-size: 12px; line-height: 1.6; font-weight: 400;">
                          <strong style="font-weight: 700;">Important Security Notice:</strong> This passcode is valid for a single session and expires in 1 hour. Do not share this passcode with anyone. GCX will never ask for your authentication codes.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Signature -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid rgba(240, 203, 135, 0.08); padding-top: 20px;">
                <tr>
                  <td align="left" style="color: #71717a; font-size: 13px; line-height: 1.5;">
                    Best regards,<br>
                    <strong style="color: #a1a1aa;">GCX Security</strong>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Block -->
          <tr>
            <td align="center" style="background: #0d0d0f; padding: 30px 40px; border-top: 1px solid rgba(240, 203, 135, 0.08);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <span style="font-family: 'Unbounded', 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; font-weight: 700; color: #f0cb87; letter-spacing: 0.5px;">GCX</span>
                    <span style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; color: #71717a; margin-left: 4px;">· Gift Card Exchange</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="http://localhost:3000/privacy" style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; font-weight: 500; color: #a1a1aa; text-decoration: none; margin: 0 10px;">Privacy</a>
                    <a href="http://localhost:3000/terms" style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; font-weight: 500; color: #a1a1aa; text-decoration: none; margin: 0 10px;">Terms</a>
                    <a href="http://localhost:3000/support" style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; font-weight: 500; color: #a1a1aa; text-decoration: none; margin: 0 10px;">Support</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 11px; color: #71717a; line-height: 1.5;">
                    This is an automated operational transmission. Replies to this mailbox are unmonitored.<br>
                    &copy; 2026 GCX. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    };

    const info = await transporter.sendMail(mailOptions);
    if ((transporter.options as any).host === 'smtp.ethereal.email') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[AUTH] Ethereal Email Sent! Preview URL: ${previewUrl}`);
      return NextResponse.json({
        success: true,
        message: 'OTP sent via Ethereal sandbox.',
        previewUrl
      });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully to veltrix620@gmail.com.' });
  } catch (err) {
    console.error("Failed to deliver OTP email:", err);
    return NextResponse.json({
      success: true,
      message: 'OTP email delivery failed, code printed to terminal console.'
    });
  }
}
