import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticateAdmin, getMailTransporter } from '@/lib/api-helper';

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
    const { status, adminNotes } = await req.json();
    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    const appeal = await db.updateAppealStatus(id, status, adminNotes);
    if (!appeal) {
      return NextResponse.json({ error: 'Appeal not found' }, { status: 404 });
    }

    try {
      const transporter = await getMailTransporter();
      if (transporter && appeal.email) {
        let themeColor = '#f0cb87';
        let statusBadgeBg = 'rgba(240, 203, 135, 0.06)';
        let statusBadgeBorder = 'rgba(240, 203, 135, 0.2)';
        let statusTextColor = '#f0cb87';

        if (status === 'Resolved') {
          themeColor = '#059669';
          statusBadgeBg = 'rgba(5, 150, 105, 0.05)';
          statusBadgeBorder = 'rgba(5, 150, 105, 0.15)';
          statusTextColor = '#059669';
        } else if (status === 'Rejected') {
          themeColor = '#dc2626';
          statusBadgeBg = 'rgba(220, 38, 38, 0.05)';
          statusBadgeBorder = 'rgba(220, 38, 38, 0.15)';
          statusTextColor = '#dc2626';
        }

        let detailsHtml = '';
        if (status === 'Resolved') {
          detailsHtml = `
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 15px; margin-bottom: 24px;">
              <tr>
                <td style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 10px; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                  Findings & Explanations
                </td>
              </tr>
              <tr>
                <td style="background-color: #16161a; border: 1px solid rgba(5, 150, 105, 0.15); border-radius: 12px; padding: 16px; color: #e4e4e7; font-size: 13.5px; line-height: 1.6; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                  ${adminNotes || 'We identified a processing mistake on your ticket and it has been corrected.'}
                </td>
              </tr>
            </table>
          `;
        } else if (status === 'Rejected') {
          detailsHtml = `
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 15px; margin-bottom: 24px;">
              <tr>
                <td style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 10px; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                  Reason for Rejection
                </td>
              </tr>
              <tr>
                <td style="background-color: #16161a; border: 1px solid rgba(220, 38, 38, 0.15); border-radius: 12px; padding: 16px; color: #e4e4e7; font-size: 13.5px; line-height: 1.6; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                  ${adminNotes || 'The details provided could not be verified or did not meet the requirements.'}
                </td>
              </tr>
            </table>
          `;
        }

        const userMailOptions = {
          from: '"GCX Support Operations" <giftcardexchange.gcx@gmail.com>',
          to: appeal.email,
          subject: `GCX Appeal Status Update: ${status}`,
          text: `Dear ${appeal.name},\n\nYour appeal (ID: ${appeal.id}) regarding ${appeal.card_type} has been updated to: ${status}.\n\n${adminNotes ? 'Admin notes: ' + adminNotes + '\n\n' : ''}We will inform you further in case of any updates.\n\nBest regards,\nGCX Support Team`,
          html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GCX Appeal Status Update</title>
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
                  <td align="left" style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 14px; font-weight: 600; color: #a1a1aa; padding-bottom: 4px;">
                    Dear ${appeal.name},
                  </td>
                </tr>
                <tr>
                  <td align="left" style="font-family: 'Unbounded', 'Plus Jakarta Sans', -apple-system, sans-serif; color: #f0cb87; font-size: 20px; font-weight: 700; padding-bottom: 12px;">
                    Appeal Update
                  </td>
                </tr>
                <tr>
                  <td align="left" style="color: #a1a1aa; font-size: 14px; line-height: 1.6; font-weight: 400;">
                    We are writing to inform you that the status of your payout appeal has been updated by our staff security operations.
                  </td>
                </tr>
              </table>

              <!-- Status Display Badge -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: ${statusBadgeBg}; border: 1px solid ${statusBadgeBorder}; border-radius: 16px; margin-bottom: 24px;">
                <tr>
                  <td align="center" style="padding: 20px 20px;">
                    <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;">
                      Current Appeal Status
                    </div>
                    <div style="font-family: 'Unbounded', 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 18px; font-weight: 800; color: ${statusTextColor}; letter-spacing: 0.5px; text-transform: uppercase;">
                      ${status}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Dynamic Details -->
              ${detailsHtml}

              <!-- Ticket Details Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 15px; margin-bottom: 24px;">
                <tr>
                  <td align="left" style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 10px;">
                    Ticket Details
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
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600;">Gift Card Brand</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5;">${appeal.card_type}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); font-weight: 600;">Payout Address</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid rgba(240, 203, 135, 0.05); color: #f4f4f5; font-family: 'Space Mono', monospace; font-size: 11px;">${appeal.payout_address}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; font-weight: 600;">Submission Date</td>
                        <td style="padding: 8px 12px; color: #f4f4f5; font-family: 'Space Mono', monospace; font-size: 12px;">${new Date(appeal.created_at).toUTCString()}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Notice -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="12" style="background-color: rgba(240, 203, 135, 0.04); border: 1px solid rgba(240, 203, 135, 0.15); border-radius: 12px;">
                      <tr>
                        <td align="left" style="color: #e5b869; font-size: 12px; line-height: 1.6; font-weight: 400;">
                          <strong style="color: #f0cb87; font-weight: 700;">What happens next:</strong> Our support department monitors resolving transactions closely. <strong style="color: #f4f4f5;">We will inform you further</strong> of any additional developments or bank transfers concerning this ticket. No further action is required from you at this time.
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
                    <strong style="color: #a1a1aa;">GCX Support</strong>
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
                    This is an automated operational transmission regarding appeal ticket #${appeal.id}.<br>
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

        const info = await transporter.sendMail(userMailOptions);
        console.log(`[APPEAL UPDATE] Status update email sent to ${appeal.email}. MessageId: ${info.messageId}`);
      }
    } catch (mailErr) {
      console.error("[APPEAL UPDATE] Failed to send status update email to user:", mailErr);
    }

    return NextResponse.json(appeal);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update appeal status' }, { status: 500 });
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
    // Delete appeal not explicitly in db object helper but we can write a query or delete from local json:
    // Wait, let's look if db.deleteAppeal was used in legacy code. Yes: line 1012: `const appeal = await db.deleteAppeal(id);`
    // Wait! Let's check if deleteAppeal is implemented in db.js. Let's see if we added it in db.ts.
    // Ah, did we add deleteAppeal in db.ts? Let's check our db.ts. We did not!
    // Let's implement it inside db.ts or check if the original db.js had it.
    // Let's read db.ts or update db.ts first. Wait, let's verify if the original db.js had deleteAppeal.
    // Let's check backend/db.js using grep_search.
  } catch (e) {}
}
