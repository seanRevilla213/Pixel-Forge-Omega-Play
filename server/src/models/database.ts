import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/security';
import { logger } from '../utils/logger';

let db: any;
const DB_PATH = path.resolve(__dirname, '../../data/pixel_forge.db');

export const initDatabase = async (): Promise<any> => {
  const SQL = await initSqlJs();
  const dataDir = path.dirname(DB_PATH);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Enable WAL mode for better concurrent access
  db.run('PRAGMA journal_mode=WAL;');
  db.run('PRAGMA foreign_keys=ON;');

  // Force re-seed for development
  db.run('DROP TABLE IF EXISTS products;');
  
  createTables();
  await seedData();
  saveDatabase();

  logger.info('Database initialized successfully');
  return db;
};

const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      is_locked INTEGER NOT NULL DEFAULT 0,
      login_attempts INTEGER NOT NULL DEFAULT 0,
      locked_until TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT UNIQUE NOT NULL,
      device_info TEXT,
      ip_address TEXT,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      original_price REAL CHECK(original_price >= 0),
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      variants TEXT, -- JSON string of { name: string, image_url: string }[]
      badge TEXT,
      rating REAL DEFAULT 0 CHECK(rating >= 0 AND rating <= 5),
      review_count INTEGER DEFAULT 0,
      in_stock INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      platform TEXT,
      genre TEXT,
      brand TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      total REAL NOT NULL CHECK(total >= 0),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'cancelled')),
      shipping_address TEXT,
      payment_method TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      price REAL NOT NULL CHECK(price >= 0),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      resource TEXT,
      details TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
};

const seedData = async () => {
  // Check if admin exists
  const adminExists = db.exec("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
  const count = adminExists[0]?.values[0]?.[0] as number;

  if (count === 0) {
    const hashedPassword = await bcrypt.hash(config.admin.password, config.security.bcryptRounds);
    const adminId = uuidv4();

    db.run(
      `INSERT INTO users (id, email, username, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
      [adminId, config.admin.email, 'Admin', hashedPassword, 'admin']
    );
    logger.info('Admin user seeded');
  }

  // Check if products exist
  const productCount = db.exec("SELECT COUNT(*) as count FROM products");
  const pCount = productCount[0]?.values[0]?.[0] as number;

  if (pCount === 0) {
    const products = [
      {
        id: uuidv4(), name: 'Xbox 360 Glow Edition', slug: 'xbox-glow-edition',
        description: 'The iconic Xbox 360 Wireless Controller offers precision, comfort, and control. Featuring integrated 2.4 GHz high-performance wireless technology and a sleek ergonomic design, it remains a favorite for gamers across PC and console platforms.',
        price: 29.99, original_price: 39.99, category: 'Controllers',
        image_url: '/products/xbox-360-controller.jpg',
        variants: JSON.stringify([
          { id: 'v1', name: 'Carbon Black Edition', image_url: '/products/xbox-360-controller.jpg', color: '#080808', glow: 'rgba(255, 255, 255, 0.2)' },
          { id: 'v2', name: 'Aqua Edition', image_url: '/products/glow-cyan.jpg', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },
          { id: 'v3', name: 'Sapphire Blue', image_url: '/products/glow-blue.jpg', color: '#0047AB', glow: 'rgba(0, 71, 171, 0.5)' },
          { id: 'v4', name: 'Emerald White', image_url: '/products/glow-green.jpg', color: '#00ff41', glow: 'rgba(0, 255, 65, 0.5)' },
          { id: 'v5', name: 'Crimson Nebula', image_url: '/products/glow-pink.jpg', color: '#ff00ff', glow: 'rgba(255, 0, 255, 0.6)' }
        ]),
        badge: 'CLASSIC', rating: 4.9, review_count: 5120,
        in_stock: 1, featured: 1, platform: 'PC, Xbox 360', genre: 'Input Device'
      },
      {
        id: uuidv4(), name: 'Quantum Strike Force', slug: 'quantum-strike-force',
        description: 'Command an elite squad in this tactical FPS with quantum mechanics. Manipulate time, space, and reality itself to outmaneuver enemies in intense 5v5 competitive matches.',
        price: 49.99, original_price: null, category: 'FPS',
        image_url: '/api/placeholder/game2', badge: 'NEW', rating: 4.5, review_count: 1523,
        in_stock: 1, featured: 1, platform: 'PC, PS5', genre: 'Tactical Shooter'
      },
      {
        id: uuidv4(), name: 'Redragon K670 Argo', slug: 'redragon-k670-argo',
        description: 'Durable high-performance mechanical keyboard with premium build quality and excellent user ratings.',
        price: 55.03, original_price: 69.99, category: 'Mechanical Keyboards',
        image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a4550ec52b849fdbd82796c7764ff9dN.png',
        variants: JSON.stringify([
          { id: 'angle-front', name: 'Front Angle', image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a4550ec52b849fdbd82796c7764ff9dN.png', color: '#ff8c00', glow: 'rgba(255, 140, 0, 0.4)' },
          { id: 'angle-side', name: 'Side Angle', image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9fb5434d707b46d3a66970172e92c6328.png', color: '#ff8c00', glow: 'rgba(255, 140, 0, 0.4)' },
          { id: 'angle-rgb', name: 'RGB Side Lighting', image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S6c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0cE.png', color: '#ff8c00', glow: 'rgba(255, 140, 0, 0.4)' },
          { id: 'angle-top', name: 'Top View', image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7aM.png', color: '#ff8c00', glow: 'rgba(255, 140, 0, 0.4)' },
          { id: 'angle-back', name: 'Back View', image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8bP.png', color: '#ff8c00', glow: 'rgba(255, 140, 0, 0.4)' },
          { id: 'angle-perspective', name: 'Perspective View', image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9cQ.png', color: '#ff8c00', glow: 'rgba(255, 140, 0, 0.4)' }
        ]),
        badge: 'ELITE', rating: 4.8, review_count: 1240,
        in_stock: 1, featured: 1, platform: 'PC, Mac', genre: 'Mechanical Keyboard',
        brand: 'Redragon'
      },
      {
        id: uuidv4(), name: 'Razer BlackWidow V4', slug: 'razer-blackwidow-v4',
        description: 'The iconic mechanical gaming keyboard with Razer Chroma RGB and dedicated macro keys.',
        price: 169.99, original_price: 189.99, category: 'Mechanical Keyboards',
        image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf3b2a5ef122b4632832569e200c59807E.png',
        variants: JSON.stringify([
          { id: 'sw-green', name: 'Green Switch', type: 'Clicky', color: '#39ff14', glow: 'rgba(57, 255, 20, 0.5)', description: 'Tactile and clicky' },
          { id: 'sw-yellow', name: 'Yellow Switch', type: 'Linear', color: '#ffff00', glow: 'rgba(255, 255, 0, 0.5)', description: 'Smooth and silent' }
        ]),
        badge: 'PRO', rating: 4.9, review_count: 3500,
        in_stock: 1, featured: 1, platform: 'PC', genre: 'Mechanical Keyboard',
        brand: 'Razer'
      },
      {
        id: uuidv4(), name: 'Logitech G Pro X', slug: 'logitech-g-pro-x',
        description: 'Pro-grade performance with swappable switches and a compact tenkeyless design.',
        price: 149.99, original_price: null, category: 'Mechanical Keyboards',
        image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf47d0e417935492db2c91811e51b68140.png',
        variants: JSON.stringify([
          { id: 'sw-gx-blue', name: 'GX Blue', type: 'Clicky', color: '#0062ff', glow: 'rgba(0, 98, 255, 0.5)', description: 'Classic clicky' },
          { id: 'sw-gx-red', name: 'GX Red', type: 'Linear', color: '#ff3131', glow: 'rgba(255, 49, 49, 0.5)', description: 'Pro-grade linear' }
        ]),
        badge: 'CHAMPION', rating: 4.7, review_count: 2100,
        in_stock: 1, featured: 0, platform: 'PC, Mac', genre: 'Mechanical Keyboard',
        brand: 'Logitech'
      },
      {
        id: uuidv4(), name: 'Keychron Q1 Pro', slug: 'keychron-q1-pro',
        description: 'Fully customizable QMK/VIA wireless mechanical keyboard with a CNC aluminum body.',
        price: 199.99, original_price: null, category: 'Mechanical Keyboards',
        image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S553315a6b7d3419894e7769919f972b2r.png',
        variants: JSON.stringify([
          { id: 'sw-k-red', name: 'K Pro Red', type: 'Linear', color: '#ff4d4d', glow: 'rgba(255, 77, 77, 0.5)', description: 'Premium linear' },
          { id: 'sw-k-brown', name: 'K Pro Brown', type: 'Tactile', color: '#d2691e', glow: 'rgba(210, 105, 30, 0.5)', description: 'Premium tactile' }
        ]),
        badge: 'ENTHUSIAST', rating: 4.9, review_count: 890,
        in_stock: 1, featured: 1, platform: 'PC, Mac, Linux', genre: 'Mechanical Keyboard',
        brand: 'Keychron'
      },
      {
        id: uuidv4(), name: 'Royal Kludge RK61', slug: 'royal-kludge-rk61',
        description: 'Ultra-compact 60% mechanical keyboard with multi-device wireless connectivity.',
        price: 49.99, original_price: 59.99, category: 'Mechanical Keyboards',
        image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S4237d825f77846f89025c898c64188b49.png',
        variants: JSON.stringify([
          { id: 'sw-rk-blue', name: 'RK Blue', type: 'Clicky', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)', description: 'Tactile and clicky' },
          { id: 'sw-rk-red', name: 'RK Red', type: 'Linear', color: '#ff3131', glow: 'rgba(255, 49, 49, 0.5)', description: 'Smooth linear' }
        ]),
        badge: 'BUDGET KING', rating: 4.6, review_count: 5400,
        in_stock: 1, featured: 0, platform: 'PC, Mac, Mobile', genre: 'Mechanical Keyboard',
        brand: 'Royal Kludge'
      },
      {
        id: uuidv4(), name: 'Corsair K100 RGB', slug: 'corsair-k100-rgb',
        description: 'The pinnacle of Corsair keyboards, featuring AXON hyper-processing technology and OPX optical-mechanical switches.',
        price: 249.99, original_price: null, category: 'Mechanical Keyboards',
        image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9a3b6831d1024e659b85b4d4f8d55734Z.png',
        variants: JSON.stringify([
          { id: 'sw-opx', name: 'OPX Optical', type: 'Linear', color: '#ffff00', glow: 'rgba(255, 255, 0, 0.5)', description: 'Hyper-fast optical' }
        ]),
        badge: 'ULTIMATE', rating: 4.8, review_count: 1200,
        in_stock: 1, featured: 1, platform: 'PC', genre: 'Mechanical Keyboard',
        brand: 'Corsair'
      },
      {
        id: uuidv4(), name: 'SteelSeries Apex Pro', slug: 'steelseries-apex-pro',
        description: 'The worlds fastest keyboard with OmniPoint 2.0 adjustable mechanical switches.',
        price: 199.99, original_price: 219.99, category: 'Mechanical Keyboards',
        image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S8f96e417a80b4393963488887e221379C.png',
        variants: JSON.stringify([
          { id: 'sw-omni', name: 'OmniPoint', type: 'Adjustable', color: '#ff4500', glow: 'rgba(255, 69, 0, 0.5)', description: 'Adjustable actuation' }
        ]),
        badge: 'ESPORTS', rating: 4.9, review_count: 2800,
        in_stock: 1, featured: 0, platform: 'PC, Mac', genre: 'Mechanical Keyboard',
        brand: 'SteelSeries'
      },
      {
        id: uuidv4(), name: 'HyperX Alloy Origins', slug: 'hyperx-alloy-origins',
        description: 'Compact, sturdy keyboard featuring custom HyperX mechanical switches designed for style and performance.',
        price: 109.99, original_price: null, category: 'Mechanical Keyboards',
        image_url: 'https://ae-pic-a1.aliexpress-media.com/kf/S053075a3637e4088a531e847688849b2t.png',
        variants: JSON.stringify([
          { id: 'sw-hx-red', name: 'HyperX Red', type: 'Linear', color: '#ff0000', glow: 'rgba(255, 0, 0, 0.5)', description: 'Fast and fluid' },
          { id: 'sw-hx-aqua', name: 'HyperX Aqua', type: 'Tactile', color: '#00ffff', glow: 'rgba(0, 255, 255, 0.5)', description: 'Tactile response' }
        ]),
        badge: 'TOP RATED', rating: 4.7, review_count: 4200,
        in_stock: 1, featured: 1, platform: 'PC, PS5, Xbox', genre: 'Mechanical Keyboard',
        brand: 'HyperX'
      },
      {
        id: uuidv4(), name: 'Shadow Protocol', slug: 'shadow-protocol',
        description: 'A stealth-action masterpiece. Infiltrate heavily guarded facilities, eliminate high-value targets, and unravel a global conspiracy that threatens world order.',
        price: 54.99, original_price: null, category: 'Action',
        image_url: '/api/placeholder/game4', badge: null, rating: 4.7, review_count: 3102,
        in_stock: 1, featured: 0, platform: 'PC, PS5, Xbox', genre: 'Stealth Action'
      },
      {
        id: uuidv4(), name: 'Stellar Odyssey', slug: 'stellar-odyssey',
        description: 'Explore a procedurally generated universe with billions of unique planets. Build colonies, trade across star systems, and uncover ancient alien civilizations.',
        price: 44.99, original_price: 59.99, category: 'Adventure',
        image_url: '/api/placeholder/game5', badge: 'SALE', rating: 4.4, review_count: 2156,
        in_stock: 1, featured: 1, platform: 'PC', genre: 'Space Exploration'
      },
      {
        id: uuidv4(), name: 'Blade Fury Online', slug: 'blade-fury-online',
        description: 'Enter a massive multiplayer world of sword and sorcery. Join guilds, conquer dungeons, and battle in epic realm-vs-realm warfare with thousands of players.',
        price: 29.99, original_price: null, category: 'MMORPG',
        image_url: '/api/placeholder/game6', badge: 'FREE DLC', rating: 4.3, review_count: 5678,
        in_stock: 1, featured: 0, platform: 'PC, PS5, Xbox', genre: 'MMORPG'
      },
      {
        id: uuidv4(), name: 'Pixel Legends Arena', slug: 'pixel-legends-arena',
        description: 'A retro-inspired battle arena with modern mechanics. Choose from 50+ pixel heroes, each with unique abilities, in this fast-paced competitive MOBA.',
        price: 0, original_price: null, category: 'MOBA',
        image_url: '/api/placeholder/game7', badge: 'FREE', rating: 4.2, review_count: 8934,
        in_stock: 1, featured: 0, platform: 'PC, Mobile', genre: 'MOBA'
      },
      {
        id: uuidv4(), name: 'Fortress Defense X', slug: 'fortress-defense-x',
        description: 'The ultimate tower defense experience. Build, upgrade, and strategize your fortress against waves of increasingly powerful enemies across 100+ levels.',
        price: 19.99, original_price: 29.99, category: 'Strategy',
        image_url: '/api/placeholder/game8', badge: 'SALE', rating: 4.5, review_count: 1234,
        in_stock: 1, featured: 0, platform: 'PC, Mobile, Switch', genre: 'Tower Defense'
      },
    ];

    const stmt = `INSERT INTO products (id, name, slug, description, price, original_price, category, image_url, variants, badge, rating, review_count, in_stock, featured, platform, genre, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    for (const p of products) {
      db.run(stmt, [
        p.id, p.name, p.slug, p.description, p.price, p.original_price,
        p.category, p.image_url, (p as any).variants || null, p.badge, p.rating, p.review_count,
        p.in_stock, p.featured, p.platform, p.genre, (p as any).brand || null
      ]);
    }
    logger.info(`Seeded ${products.length} products`);
    saveDatabase();
  }
};

export const saveDatabase = () => {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
};

// Save periodically
setInterval(saveDatabase, 30000);

export const getDb = (): any => {
  if (!db) throw new Error('Database not initialized');
  return db;
};

export default { initDatabase, getDb, saveDatabase };
