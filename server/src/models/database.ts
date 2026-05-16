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
        id: uuidv4(), name: 'Xbox 360 Wireless Controller', slug: 'xbox-360-wireless-controller',
        description: 'The iconic Xbox 360 Wireless Controller offers precision, comfort, and control. Featuring integrated 2.4 GHz high-performance wireless technology and a sleek ergonomic design.',
        price: 29.99, original_price: 39.99, category: 'Controllers',
        image_url: '/products/xbox-360-controller.jpg',
        variants: JSON.stringify([
          { id: 'v1', name: 'Carbon Black', image_url: '/products/xbox-360-controller.jpg', color: '#080808', glow: 'rgba(255, 255, 255, 0.15)' },
          { id: 'v2', name: 'Cyan', image_url: '/products/glow-cyan.jpg', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)' },
          { id: 'v3', name: 'Blue', image_url: '/products/glow-blue.jpg', color: '#0047AB', glow: 'rgba(0, 71, 171, 0.5)' },
          { id: 'v4', name: 'Green', image_url: '/products/glow-green.jpg', color: '#00ff41', glow: 'rgba(0, 255, 65, 0.5)' },
          { id: 'v5', name: 'Pink', image_url: '/products/glow-pink.jpg', color: '#ff00ff', glow: 'rgba(255, 0, 255, 0.6)' }
        ]),
        badge: 'CLASSIC', rating: 4.9, review_count: 5120,
        in_stock: 1, featured: 1, platform: 'PC, Xbox 360', genre: 'Input Device'
      },
      {
        id: uuidv4(), name: 'Redragon K670 Argo', slug: 'redragon-k670-argo',
        description: '75% Wireless Mechanical Keyboard with Gasket Mount and RGB lighting. Designed for the ultimate typing and gaming experience.',
        price: 89.99, original_price: 119.99, category: 'Mechanical Keyboards',
        image_url: 'https://redragonshop.com/cdn/shop/products/ArgoK670_1_800x.png',
        variants: JSON.stringify([
          { id: 'v1', name: 'Argo Edition', image_url: 'https://redragonshop.com/cdn/shop/products/ArgoK670_1_800x.png', color: '#ff8c00', glow: 'rgba(255, 140, 0, 0.4)' }
        ]),
        badge: 'NEW', rating: 4.8, review_count: 850,
        in_stock: 1, featured: 1, platform: 'PC, Mac', genre: 'Keyboard'
      },
      {
        id: uuidv4(), name: 'Logitech G Pro X Superlight', slug: 'logitech-g-pro-x-superlight',
        description: 'Ultra-lightweight wireless gaming mouse with HERO 25K sensor. Designed with top esports pros for maximum performance.',
        price: 149.99, original_price: null, category: 'Gaming Mouse',
        image_url: 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-black-gallery-1.png?v=1',
        badge: 'ELITE', rating: 4.9, review_count: 12400,
        in_stock: 1, featured: 1, platform: 'PC', genre: 'Mouse'
      },
      {
        id: uuidv4(), name: 'Razer BlackShark V2 Pro', slug: 'razer-blackshark-v2-pro',
        description: 'Wireless esports headset with HyperClear Super Wideband Mic and TriForce Titanium 50mm Drivers.',
        price: 199.99, original_price: null, category: 'Headsets',
        image_url: 'https://assets2.razerzone.com/images/pnx.assets/95213606f36599ccb2682974447475f4/razer-blackshark-v2-pro-2023-black-500x500.png',
        badge: 'WIRELESS', rating: 4.7, review_count: 3500,
        in_stock: 1, featured: 1, platform: 'PC, PS5, Switch', genre: 'Audio'
      },
      {
        id: uuidv4(), name: 'PlayStation 5 Console', slug: 'playstation-5',
        description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
        price: 499.99, original_price: null, category: 'Consoles',
        image_url: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$',
        badge: 'NEXT GEN', rating: 4.9, review_count: 45000,
        in_stock: 1, featured: 0, platform: 'PS5', genre: 'Console'
      },
      {
        id: uuidv4(), name: 'HyperX QuadCast S', slug: 'hyperx-quadcast-s',
        description: 'USB Condenser Microphone with RGB lighting and anti-vibration shock mount. Perfect for streaming and content creation.',
        price: 159.99, original_price: 179.99, category: 'Accessories',
        image_url: 'https://row.hyperx.com/cdn/shop/products/hyperx_quadcast_s_1_800x.png',
        badge: 'STREAMING', rating: 4.8, review_count: 6700,
        in_stock: 1, featured: 0, platform: 'PC, Mac, PS5', genre: 'Microphone'
      }
    ];

    const stmt = `INSERT INTO products (id, name, slug, description, price, original_price, category, image_url, variants, badge, rating, review_count, in_stock, featured, platform, genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    for (const p of products) {
      db.run(stmt, [
        p.id, p.name, p.slug, p.description, p.price, p.original_price,
        p.category, p.image_url, (p as any).variants || null, p.badge, p.rating, p.review_count,
        p.in_stock, p.featured, p.platform, p.genre,
      ]);
    }
    logger.info(`Seeded ${products.length} products`);
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
