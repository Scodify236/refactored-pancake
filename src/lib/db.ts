import { getCloudflareContext } from "@opennextjs/cloudflare";
import fs from 'fs';
import path from 'path';

const defaultLocalData = {
  cards: [
    { id: 1, name: "Amazon", img: "amazon", tag: "Shopping", glow: "rgba(255, 153, 0, 0.4)", variants: [] },
    { id: 2, name: "Flipkart", img: "flipkart", tag: "Shopping", glow: "rgba(40, 116, 240, 0.4)", variants: [] },
    { id: 3, name: "Roblox", img: "roblox", tag: "Gaming", glow: "rgba(239, 68, 68, 0.4)", variants: [] },
    { id: 4, name: "League of Legends", img: "lol", tag: "Gaming", glow: "rgba(197, 168, 128, 0.35)", variants: [] },
    { id: 5, name: "Overwatch 2", img: "overwatch", tag: "Gaming", glow: "rgba(240, 100, 20, 0.4)", variants: [] },
    { id: 6, name: "Sea of Thieves", img: "sot", tag: "Gaming", glow: "rgba(16, 185, 129, 0.4)", variants: [] },
  ],
  payouts: [],
  reviews: [],
  appeals: []
};

let useLocalDb = false;
let memoryDb: any = null;

const initD1Db = async (d1: any) => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      img TEXT NOT NULL,
      tag TEXT NOT NULL,
      glow TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS card_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
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

  try {
    const cardCountRes = await d1.prepare("SELECT COUNT(*) as count FROM cards").first();
    if (!cardCountRes || cardCountRes.count === 0) {
      console.log("Seeding cards database in D1...");
      const seedCards = [
        { name: "Amazon", img: "amazon", tag: "Shopping", glow: "rgba(255, 153, 0, 0.4)" },
        { name: "Flipkart", img: "flipkart", tag: "Shopping", glow: "rgba(40, 116, 240, 0.4)" },
        { name: "Roblox", img: "roblox", tag: "Gaming", glow: "rgba(239, 68, 68, 0.4)" },
        { name: "League of Legends", img: "lol", tag: "Gaming", glow: "rgba(197, 168, 128, 0.35)" },
        { name: "Overwatch 2", img: "overwatch", tag: "Gaming", glow: "rgba(240, 100, 20, 0.4)" },
        { name: "Sea of Thieves", img: "sot", tag: "Gaming", glow: "rgba(16, 185, 129, 0.4)" }
      ];

      for (const card of seedCards) {
        await d1.prepare(
          "INSERT INTO cards (name, img, tag, glow) VALUES (?, ?, ?, ?)"
        ).bind(card.name, card.img, card.tag, card.glow).run();
      }
      console.log("D1 seeding cards completed.");
    }
  } catch (err: any) {
    console.error("D1 seeding check error:", err.message || err);
  }
};

function readLocalDb() {
  const isEdge = typeof globalThis.WebSocketPair !== 'undefined' || process.env.NEXT_RUNTIME === 'edge';
  if (isEdge || !fs || !fs.existsSync) {
    if (!memoryDb) memoryDb = JSON.parse(JSON.stringify(defaultLocalData));
    return memoryDb;
  }
  try {
    const LOCAL_DB_PATH = path.resolve('database.json');
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(defaultLocalData, null, 2));
      return defaultLocalData;
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (!memoryDb) memoryDb = JSON.parse(JSON.stringify(defaultLocalData));
    return memoryDb;
  }
}

function writeLocalDb(data: any) {
  const isEdge = typeof globalThis.WebSocketPair !== 'undefined' || process.env.NEXT_RUNTIME === 'edge';
  if (isEdge || !fs || !fs.writeFileSync) {
    memoryDb = data;
    return;
  }
  try {
    const LOCAL_DB_PATH = path.resolve('database.json');
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    memoryDb = data;
  }
}

let initPromise: Promise<void> | null = null;
const ensureDb = async () => {
  let d1: any = null;
  try {
    const context = getCloudflareContext();
    d1 = context?.env?.DB;
  } catch (e) {
    // Fallback to local DB when context is unavailable
  }

  if (d1) {
    useLocalDb = false;
    if (!initPromise) {
      initPromise = initD1Db(d1);
    }
    await initPromise;
    return d1;
  } else {
    useLocalDb = true;
    return null;
  }
};

export const db = {
  getCards: async () => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        const cardsRes = await d1.prepare("SELECT * FROM cards ORDER BY id ASC").all();
        const cards = cardsRes.results || [];
        const variantsRes = await d1.prepare("SELECT * FROM card_variants").all();
        const variants = variantsRes.results || [];
        
        return cards.map((c: any) => ({
          ...c,
          variants: variants.filter((v: any) => v.card_id === c.id)
        }));
      } catch (err) {
        console.error("D1 getCards failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    return readLocalDb().cards;
  },

  createCard: async (name: string, img: string, tag: string, glow: string) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        const res = await d1.prepare(
          'INSERT INTO cards (name, img, tag, glow) VALUES (?, ?, ?, ?) RETURNING *'
        ).bind(name, img, tag, glow).first();
        if (res) {
          res.variants = [];
          return res;
        }
      } catch (err) {
        console.error("D1 createCard failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const newCard = { id: Date.now(), name, img, tag, glow, variants: [] };
    data.cards.push(newCard);
    writeLocalDb(data);
    return newCard;
  },

  deleteCard: async (id: string | number) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare('DELETE FROM cards WHERE id = ? RETURNING *').bind(Number(id)).first();
      } catch (err) {
        console.error("D1 deleteCard failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const card = data.cards.find(c => c.id == id);
    data.cards = data.cards.filter(c => c.id != id);
    writeLocalDb(data);
    return card;
  },

  createVariant: async (cardId: string | number, name: string, inrRate: string | null, usdtRate: string | null) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare(
          'INSERT INTO card_variants (card_id, name, inr_rate, usdt_rate) VALUES (?, ?, ?, ?) RETURNING *'
        ).bind(Number(cardId), name, inrRate || null, usdtRate || null).first();
      } catch (err) {
        console.error("D1 createVariant failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const card = data.cards.find(c => c.id == cardId);
    if (card) {
      const newVar = { id: Date.now(), name, inr_rate: inrRate || null, usdt_rate: usdtRate || null };
      card.variants = card.variants || [];
      card.variants.push(newVar);
      writeLocalDb(data);
      return newVar;
    }
    return null;
  },

  updateVariant: async (id: string | number, name: string, inrRate: string | null, usdtRate: string | null) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare(
          'UPDATE card_variants SET name = ?, inr_rate = ?, usdt_rate = ? WHERE id = ? RETURNING *'
        ).bind(name, inrRate || null, usdtRate || null, Number(id)).first();
      } catch (err) {
        console.error("D1 updateVariant failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    let updated = null;
    data.cards.forEach(c => {
      if (c.variants) {
        const v = c.variants.find(varItem => varItem.id == id);
        if (v) {
          v.name = name;
          v.inr_rate = inrRate || null;
          v.usdt_rate = usdtRate || null;
          updated = v;
        }
      }
    });
    writeLocalDb(data);
    return updated;
  },

  deleteVariant: async (id: string | number) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare('DELETE FROM card_variants WHERE id = ? RETURNING *').bind(Number(id)).first();
      } catch (err) {
        console.error("D1 deleteVariant failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    let deleted = null;
    data.cards.forEach(c => {
      if (c.variants) {
        const v = c.variants.find(varItem => varItem.id == id);
        if (v) {
          deleted = v;
          c.variants = c.variants.filter(varItem => varItem.id != id);
        }
      }
    });
    writeLocalDb(data);
    return deleted;
  },

  getReviews: async () => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        const res = await d1.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
        return res.results || [];
      } catch (err) {
        console.error("D1 getReviews failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    return data.reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createReview: async (name: string, role: string, avatar_url: string, quote: string, rating: number, trade_type: string, proof_image_url: string, region: string | null, gc_received_date: string | null, payment_sent_date: string | null, amount?: number, amount_label?: string) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare(
          'INSERT INTO reviews (name, role, avatar_url, quote, rating, trade_type, proof_image_url, region, gc_received_date, payment_sent_date, verified, amount, amount_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?) RETURNING *'
        ).bind(name, role, avatar_url, quote, rating, trade_type, proof_image_url, region || null, gc_received_date || null, payment_sent_date || null, amount || 0, amount_label || '').first();
      } catch (err) {
        console.error("D1 createReview failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const newReview = {
      id: Date.now(),
      name,
      role: role || 'Customer',
      avatar_url: avatar_url || '',
      quote,
      rating: rating || 5,
      trade_type,
      proof_image_url,
      region: region || null,
      gc_received_date: gc_received_date || null,
      payment_sent_date: payment_sent_date || null,
      amount: amount || 0,
      amount_label: amount_label || '',
      verified: true,
      created_at: new Date().toISOString()
    };
    data.reviews.push(newReview);
    writeLocalDb(data);
    return newReview;
  },

  updateReview: async (id: string | number, name: string, role: string, avatar_url: string, quote: string, rating: number, trade_type: string, proof_image_url: string, region: string | null, gc_received_date: string | null, payment_sent_date: string | null, amount?: number, amount_label?: string) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare(
          'UPDATE reviews SET name = ?, role = ?, avatar_url = ?, quote = ?, rating = ?, trade_type = ?, proof_image_url = ?, region = ?, gc_received_date = ?, payment_sent_date = ?, amount = ?, amount_label = ? WHERE id = ? RETURNING *'
        ).bind(name, role, avatar_url, quote, rating, trade_type, proof_image_url, region || null, gc_received_date || null, payment_sent_date || null, amount || 0, amount_label || '', Number(id)).first();
      } catch (err) {
        console.error("D1 updateReview failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const review = data.reviews.find(r => r.id == id);
    if (review) {
      review.name = name;
      review.role = role || 'Customer';
      review.avatar_url = avatar_url || '';
      review.quote = quote;
      review.rating = rating || 5;
      review.trade_type = trade_type;
      review.proof_image_url = proof_image_url;
      review.region = region || null;
      review.gc_received_date = gc_received_date || null;
      review.payment_sent_date = payment_sent_date || null;
      review.amount = amount || 0;
      review.amount_label = amount_label || '';
      writeLocalDb(data);
    }
    return review;
  },

  deleteReview: async (id: string | number) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare('DELETE FROM reviews WHERE id = ? RETURNING *').bind(Number(id)).first();
      } catch (err) {
        console.error("D1 deleteReview failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const review = data.reviews.find(r => r.id == id);
    data.reviews = data.reviews.filter(r => r.id != id);
    writeLocalDb(data);
    return review;
  },

  getPayouts: async () => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        const res = await d1.prepare('SELECT * FROM payouts ORDER BY submission_date DESC').all();
        return res.results || [];
      } catch (err) {
        console.error("D1 getPayouts failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    return data.payouts.sort((a, b) => new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime());
  },

  createPayout: async (submission_date: string, payout_date: string, amount: string, card_type: string, method: string, status: string) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare(
          'INSERT INTO payouts (submission_date, payout_date, amount, card_type, method, status) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
        ).bind(submission_date, payout_date, amount, card_type, method, status || 'Completed').first();
      } catch (err) {
        console.error("D1 createPayout failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const newPayout = {
      id: Date.now(),
      submission_date,
      payout_date,
      amount,
      card_type,
      method,
      status: status || 'Completed',
      created_at: new Date().toISOString()
    };
    data.payouts.push(newPayout);
    writeLocalDb(data);
    return newPayout;
  },

  createPayoutsBatch: async (payouts: any[]) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        const statements = payouts.map(p =>
          d1.prepare('INSERT INTO payouts (submission_date, payout_date, amount, card_type, method, status) VALUES (?, ?, ?, ?, ?, ?) RETURNING *')
            .bind(p.submission_date, p.payout_date, p.amount, p.card_type, p.method, 'Completed')
        );
        const results = await d1.batch(statements);
        return results.map((r: any) => r.results?.[0]).filter(Boolean);
      } catch (err) {
        console.error("D1 createPayoutsBatch failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const inserted = payouts.map((p, idx) => ({
      id: Date.now() + idx,
      submission_date: p.submission_date,
      payout_date: p.payout_date,
      amount: p.amount,
      card_type: p.card_type,
      method: p.method,
      status: 'Completed',
      created_at: new Date().toISOString()
    }));
    data.payouts = [...data.payouts, ...inserted];
    writeLocalDb(data);
    return inserted;
  },

  updatePayout: async (id: string | number, submission_date: string, payout_date: string, amount: string, card_type: string, method: string, status: string) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare(
          'UPDATE payouts SET submission_date = ?, payout_date = ?, amount = ?, card_type = ?, method = ?, status = ? WHERE id = ? RETURNING *'
        ).bind(submission_date, payout_date, amount, card_type, method, status || 'Completed', Number(id)).first();
      } catch (err) {
        console.error("D1 updatePayout failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const payout = data.payouts.find(p => p.id == id);
    if (payout) {
      payout.submission_date = submission_date;
      payout.payout_date = payout_date;
      payout.amount = amount;
      payout.card_type = card_type;
      payout.method = method;
      payout.status = status || 'Completed';
      writeLocalDb(data);
    }
    return payout;
  },

  deletePayout: async (id: string | number) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare('DELETE FROM payouts WHERE id = ? RETURNING *').bind(Number(id)).first();
      } catch (err) {
        console.error("D1 deletePayout failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    const payout = data.payouts.find(p => p.id == id);
    data.payouts = data.payouts.filter(p => p.id != id);
    writeLocalDb(data);
    return payout;
  },

  getAppeals: async () => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        const res = await d1.prepare('SELECT * FROM appeals ORDER BY created_at DESC').all();
        return res.results || [];
      } catch (err) {
        console.error("D1 getAppeals failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    return (data.appeals || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createAppeal: async (name: string, phone: string, card_type: string, email: string, payout_address: string, details: string) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare(
          'INSERT INTO appeals (name, phone, card_type, email, payout_address, details, status) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *'
        ).bind(name, phone, card_type, email, payout_address, details, 'Pending').first();
      } catch (err) {
        console.error("D1 createAppeal failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    data.appeals = data.appeals || [];
    const newAppeal = {
      id: Date.now(),
      name,
      phone,
      card_type,
      email,
      payout_address,
      details,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    data.appeals.push(newAppeal);
    writeLocalDb(data);
    return newAppeal;
  },

  updateAppealStatus: async (id: string | number, status: string, adminNotes: string | null) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare(
          'UPDATE appeals SET status = ?, admin_notes = ? WHERE id = ? RETURNING *'
        ).bind(status, adminNotes, Number(id)).first();
      } catch (err) {
        console.error("D1 updateAppealStatus failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    data.appeals = data.appeals || [];
    const appeal = data.appeals.find(a => a.id == id);
    if (appeal) {
      appeal.status = status;
      appeal.admin_notes = adminNotes || undefined;
      writeLocalDb(data);
    }
    return appeal;
  },

  deleteAppeal: async (id: string | number) => {
    const d1 = await ensureDb();
    if (d1 && !useLocalDb) {
      try {
        return await d1.prepare('DELETE FROM appeals WHERE id = ? RETURNING *').bind(Number(id)).first();
      } catch (err) {
        console.error("D1 deleteAppeal failed, switching to local DB", err);
        useLocalDb = true;
      }
    }
    const data = readLocalDb();
    data.appeals = data.appeals || [];
    const appeal = data.appeals.find((item: any) => item.id == id);
    data.appeals = data.appeals.filter((item: any) => item.id != id);
    writeLocalDb(data);
    return appeal;
  }
};
