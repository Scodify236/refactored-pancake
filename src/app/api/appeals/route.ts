import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateAdmin, getMailTransporter } from '@/lib/api-helper';

export async function GET(req: Request) {
  const auth = await authenticateAdmin(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const appeals = await db.getAppeals();
    return NextResponse.json(appeals);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to retrieve appeals' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, phone, card_type, email, payout_address, details } = await req.json();
    if (!name || !phone || !card_type || !email || !payout_address) {
      return NextResponse.json({ error: 'Missing required appeal fields' }, { status: 400 });
    }

    const appeal = await db.createAppeal(name, phone, card_type, email, payout_address, details);

    try {
      const transporter = await getMailTransporter();
      if (transporter) {
        const adminMailOptions = {
          from: '"GCX Security Operations" <giftcardexchange.gcx@gmail.com>',
          to: 'veltrix620@gmail.com',
          subject: `New Appeal Submitted: #${appeal.id}`,
          text: `A new appeal (ID: ${appeal.id}) has been submitted by ${name} (${email}) for card: ${card_type}.\nPayout Address: ${payout_address}\nDetails: ${details || 'No additional details provided.'}`,
          html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Appeal Submitted</title>
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
                    New Appeal Filed
                  </td>
                </tr>
                <tr>
                  <td align="left" style="color: #a1a1aa; font-size: 14px; line-height: 1.6; font-weight: 400;">
                    A new payout appeal has been submitted to the GCX system and requires staff review.
                  </td>
                </tr>
              </table>

              <!-- Ticket Details Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 15px; margin-bottom: 24px;">
                <tr>
                  <td align="left" style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 10px;">
                    Appeal Details
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="background-color: #16161a; border: 1px solid rgba(240, 203, 135, 0.08); border-radius: 12px; font-size: 13px; color: #a1a1aa;">
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600; width: 140px;">Appeal Ticket ID</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5; font-family: 'Space Mono', monospace; font-weight: bold;">#${appeal.id}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600;">User Name</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600;">User Email</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600;">Phone Number</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5;">${phone}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600;">Gift Card Brand</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5;">${card_type}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600;">Payout Address</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5; font-family: 'Space Mono', monospace; font-size: 11px;">${payout_address}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; font-weight: 600;">Submission Date</td>
                        <td style="padding: 8px 12px; color: #f4f4f5; font-family: 'Space Mono', monospace; font-size: 12px;">${new Date(appeal.created_at).toUTCString()}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- User Explanation Details Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 15px; margin-bottom: 24px;">
                <tr>
                  <td style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 10px; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                    User Statement & Details
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #16161a; border: 1px solid rgba(240, 203, 135, 0.12); border-radius: 12px; padding: 16px; color: #e4e4e7; font-size: 13.5px; line-height: 1.6; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                    ${details || 'No additional details provided by the user.'}
                  </td>
                </tr>
              </table>

              <!-- CTA Button to Admin Portal -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="http://localhost:3000/internal/staff/admin" target="_blank" style="display: inline-block; padding: 12px 32px; background-color: #f0cb87; border: 1.5px solid #f0cb87; border-radius: 9999px; color: #0b0b0c; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; transition: all 0.3s ease;">
                      Open Admin Portal
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Signature -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid rgba(240, 203, 135, 0.08); padding-top: 20px;">
                <tr>
                  <td align="left" style="color: #71717a; font-size: 13px; line-height: 1.5;">
                    Best regards,<br>
                    <strong style="color: #a1a1aa;">GCX Security System</strong>
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
                  <td align="center" style="font-size: 11px; color: #71717a; line-height: 1.5;">
                    This is an automated operational alert regarding appeal ticket #${appeal.id}.<br>
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
        await transporter.sendMail(adminMailOptions);
        console.log(`[APPEAL SUBMIT] Alert email sent to admin for new appeal ID: ${appeal.id}`);
      }
    } catch (mailErr) {
      console.error("[APPEAL SUBMIT] Failed to send admin alert email:", mailErr);
    }

    return NextResponse.json(appeal, { status: 211 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to submit appeal' }, { status: 500 });
  }
}
