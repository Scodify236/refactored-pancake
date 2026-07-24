import nodemailer from 'nodemailer';
import { db } from './db';

export const parseUserAgent = (ua: string | null) => {
  if (!ua) return { os: 'Unknown OS', browser: 'Unknown Browser' };

  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome') && !ua.includes('Chromium')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Opera') || ua.includes('OPR/')) browser = 'Opera';
  else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'Internet Explorer';

  return { os, browser };
};

export const getMailTransporter = async () => {
  const user = process.env.SMTP_USER || 'giftcardexchange.gcx@gmail.com';
  const pass = process.env.SMTP_PASS || 'ldix efgh zdha yamt';

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user,
      pass
    }
  });
};

export const authenticateAdmin = async (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'Unauthorized. Missing token.', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  const session = await db.getSession(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) await db.deleteSession(token);
    return { authenticated: false, error: 'Session expired or invalid token.', status: 401 };
  }

  return { authenticated: true, session };
};
