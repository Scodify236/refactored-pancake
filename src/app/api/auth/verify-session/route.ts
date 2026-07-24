import { db } from '@/lib/db';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ valid: false, error: 'Missing token' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const session = await db.getSession(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) await db.deleteSession(token);
    return NextResponse.json({ valid: false, error: 'Session invalid or expired' }, { status: 401 });
  }

  return NextResponse.json({ valid: true, expiresAt: session.expiresAt });
}
