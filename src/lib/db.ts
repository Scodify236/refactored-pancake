import { getCloudflareContext } from "@opennextjs/cloudflare";

const HARDCODED_CARDS = [
  { id: 1, name: "Amazon", img: "amazon", tag: "Shopping", glow: "rgba(255, 153, 0, 0.4)" },
  { id: 2, name: "Flipkart", img: "flipkart", tag: "Shopping", glow: "rgba(40, 116, 240, 0.4)" },
  { id: 3, name: "Roblox", img: "roblox", tag: "Gaming", glow: "rgba(239, 68, 68, 0.4)" },
  { id: 4, name: "League of Legends", img: "lol", tag: "Gaming", glow: "rgba(197, 168, 128, 0.35)" },
  { id: 5, name: "Overwatch 2", img: "overwatch", tag: "Gaming", glow: "rgba(240, 100, 20, 0.4)" },
  { id: 6, name: "Sea of Thieves", img: "sot", tag: "Gaming", glow: "rgba(16, 185, 129, 0.4)" }
];

const initD1Db = async (d1: any) => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS card_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      inr_rate TEXT,
      usdt_rate TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'Customer',
      avatar_url TEXT,
      quote TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      trade_type TEXT NOT NULL,
      proof_image_url TEXT NOT NULL,
      verified INTEGER DEFAULT 1,
      region TEXT,
      gc_received_date TEXT,
      payment_sent_date TEXT,
      amount REAL DEFAULT 0,
      amount_label TEXT DEFAULT '',
      admin_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS payouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_date TEXT NOT NULL,
      payout_date TEXT NOT NULL,
      amount TEXT NOT NULL,
      card_type TEXT NOT NULL,
      method TEXT NOT NULL,
      status TEXT DEFAULT 'Completed',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS appeals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      card_type TEXT NOT NULL,
      email TEXT NOT NULL,
      payout_address TEXT NOT NULL,
      details TEXT,
      status TEXT DEFAULT 'Pending',
      admin_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const tableSql of tables) {
    try {
      await d1.prepare(tableSql).run();
    } catch (err: any) {
      console.error("D1 Init table error:", err.message || err);
    }
  }
};

let initPromise: Promise<void> | null = null;
const ensureDb = async () => {
  const context = getCloudflareContext();
  const d1 = context?.env?.DB;
  if (!d1) {
    throw new Error("Cloudflare D1 DB binding 'DB' not found in env context.");
  }
  if (!initPromise) {
    initPromise = initD1Db(d1);
  }
  await initPromise;
  return d1;
};

export const db = {
  getCards: async () => {
    const d1 = await ensureDb();
    const variantsRes = await d1.prepare("SELECT * FROM card_variants").all();
    const variants = variantsRes.results || [];
    
    return HARDCODED_CARDS.map((c: any) => ({
      ...c,
      variants: variants.filter((v: any) => Number(v.card_id) === c.id)
    }));
  },

  createCard: async (name: string, img: string, tag: string, glow: string) => {
    return { id: Date.now(), name, img, tag, glow, variants: [] };
  },

  deleteCard: async (id: string | number) => {
    return HARDCODED_CARDS.find(c => c.id === Number(id)) || null;
  },

  createVariant: async (cardId: string | number, name: string, inrRate: string | null, usdtRate: string | null) => {
    const d1 = await ensureDb();
    return await d1.prepare(
      'INSERT INTO card_variants (card_id, name, inr_rate, usdt_rate) VALUES (?, ?, ?, ?) RETURNING *'
    ).bind(Number(cardId), name, inrRate || null, usdtRate || null).first();
  },

  updateVariant: async (id: string | number, name: string, inrRate: string | null, usdtRate: string | null) => {
    const d1 = await ensureDb();
    return await d1.prepare(
      'UPDATE card_variants SET name = ?, inr_rate = ?, usdt_rate = ? WHERE id = ? RETURNING *'
    ).bind(name, inrRate || null, usdtRate || null, Number(id)).first();
  },

  deleteVariant: async (id: string | number) => {
    const d1 = await ensureDb();
    return await d1.prepare('DELETE FROM card_variants WHERE id = ? RETURNING *').bind(Number(id)).first();
  },

  getReviews: async () => {
    const d1 = await ensureDb();
    const res = await d1.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
    return res.results || [];
  },

  createReview: async (name: string, role: string, avatar_url: string, quote: string, rating: number, trade_type: string, proof_image_url: string, region: string | null, gc_received_date: string | null, payment_sent_date: string | null, amount?: number, amount_label?: string) => {
    const d1 = await ensureDb();
    return await d1.prepare(
      'INSERT INTO reviews (name, role, avatar_url, quote, rating, trade_type, proof_image_url, region, gc_received_date, payment_sent_date, verified, amount, amount_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?) RETURNING *'
    ).bind(name, role, avatar_url, quote, rating, trade_type, proof_image_url, region || null, gc_received_date || null, payment_sent_date || null, amount || 0, amount_label || '').first();
  },

  updateReview: async (id: string | number, name: string, role: string, avatar_url: string, quote: string, rating: number, trade_type: string, proof_image_url: string, region: string | null, gc_received_date: string | null, payment_sent_date: string | null, amount?: number, amount_label?: string) => {
    const d1 = await ensureDb();
    return await d1.prepare(
      'UPDATE reviews SET name = ?, role = ?, avatar_url = ?, quote = ?, rating = ?, trade_type = ?, proof_image_url = ?, region = ?, gc_received_date = ?, payment_sent_date = ?, amount = ?, amount_label = ? WHERE id = ? RETURNING *'
    ).bind(name, role, avatar_url, quote, rating, trade_type, proof_image_url, region || null, gc_received_date || null, payment_sent_date || null, amount || 0, amount_label || '', Number(id)).first();
  },

  deleteReview: async (id: string | number) => {
    const d1 = await ensureDb();
    return await d1.prepare('DELETE FROM reviews WHERE id = ? RETURNING *').bind(Number(id)).first();
  },

  getPayouts: async () => {
    const d1 = await ensureDb();
    const res = await d1.prepare('SELECT * FROM payouts ORDER BY submission_date DESC').all();
    return res.results || [];
  },

  createPayout: async (submission_date: string, payout_date: string, amount: string, card_type: string, method: string, status: string) => {
    const d1 = await ensureDb();
    return await d1.prepare(
      'INSERT INTO payouts (submission_date, payout_date, amount, card_type, method, status) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
    ).bind(submission_date, payout_date, amount, card_type, method, status || 'Completed').first();
  },

  createPayoutsBatch: async (payouts: any[]) => {
    const d1 = await ensureDb();
    const statements = payouts.map(p =>
      d1.prepare('INSERT INTO payouts (submission_date, payout_date, amount, card_type, method, status) VALUES (?, ?, ?, ?, ?, ?) RETURNING *')
        .bind(p.submission_date, p.payout_date, p.amount, p.card_type, p.method, 'Completed')
    );
    const results = await d1.batch(statements);
    return results.map((r: any) => r.results?.[0]).filter(Boolean);
  },

  updatePayout: async (id: string | number, submission_date: string, payout_date: string, amount: string, card_type: string, method: string, status: string) => {
    const d1 = await ensureDb();
    return await d1.prepare(
      'UPDATE payouts SET submission_date = ?, payout_date = ?, amount = ?, card_type = ?, method = ?, status = ? WHERE id = ? RETURNING *'
    ).bind(submission_date, payout_date, amount, card_type, method, status || 'Completed', Number(id)).first();
  },

  deletePayout: async (id: string | number) => {
    const d1 = await ensureDb();
    return await d1.prepare('DELETE FROM payouts WHERE id = ? RETURNING *').bind(Number(id)).first();
  },

  getAppeals: async () => {
    const d1 = await ensureDb();
    const res = await d1.prepare('SELECT * FROM appeals ORDER BY created_at DESC').all();
    return res.results || [];
  },

  createAppeal: async (name: string, phone: string, card_type: string, email: string, payout_address: string, details: string) => {
    const d1 = await ensureDb();
    return await d1.prepare(
      'INSERT INTO appeals (name, phone, card_type, email, payout_address, details, status) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *'
    ).bind(name, phone, card_type, email, payout_address, details, 'Pending').first();
  },

  updateAppealStatus: async (id: string | number, status: string, adminNotes: string | null) => {
    const d1 = await ensureDb();
    return await d1.prepare(
      'UPDATE appeals SET status = ?, admin_notes = ? WHERE id = ? RETURNING *'
    ).bind(status, adminNotes, Number(id)).first();
  },

  deleteAppeal: async (id: string | number) => {
    const d1 = await ensureDb();
    return await d1.prepare('DELETE FROM appeals WHERE id = ? RETURNING *').bind(Number(id)).first();
  }
};
