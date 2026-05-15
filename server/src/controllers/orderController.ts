import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../models/database';
import { logger, auditLog } from '../utils/logger';
import { sendOrderConfirmation } from '../utils/emailService';

const rowsToObjects = (result: any[]): Record<string, any>[] => {
  if (result.length === 0 || result[0].values.length === 0) return [];
  return result[0].values.map((row: any[]) => {
    const obj: Record<string, any> = {};
    result[0].columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj;
  });
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const db = getDb();
    const userId = req.user!.userId;

    let total = 0;
    const validatedItems: Array<{ productId: string; quantity: number; price: number }> = [];

    for (const item of items) {
      const result = db.exec("SELECT * FROM products WHERE id = ? AND in_stock = 1", [item.productId] as any);
      const products = rowsToObjects(result);

      if (products.length === 0) {
        res.status(400).json({ error: `Product ${item.productId} not found or out of stock` });
        return;
      }

      const product = products[0];
      validatedItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
      total += product.price * item.quantity;
    }

    const orderId = uuidv4();
    db.run(
      `INSERT INTO orders (id, user_id, total, status, shipping_address, payment_method) VALUES (?, ?, ?, 'pending', ?, ?)`,
      [orderId, userId, total, shippingAddress, paymentMethod]
    );

    for (const item of validatedItems) {
      db.run(
        `INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), orderId, item.productId, item.quantity, item.price]
      );
    }

    saveDatabase();
    auditLog('ORDER_CREATED', userId, { orderId, total, itemCount: items.length });

    // Send confirmation email asynchronously
    const userResult = db.exec("SELECT email, name FROM users WHERE id = ?", [userId] as any);
    const users = rowsToObjects(userResult);
    if (users.length > 0) {
      const productDetails = validatedItems.map(vi => {
        const pResult = db.exec("SELECT name FROM products WHERE id = ?", [vi.productId] as any);
        const p = rowsToObjects(pResult);
        return { name: p[0]?.name || 'Unknown Component', quantity: vi.quantity, price: vi.price };
      });

      sendOrderConfirmation({
        customerName: users[0].name,
        customerEmail: users[0].email,
        orderId,
        items: productDetails,
        total,
        deliveryInfo: shippingAddress,
      }).catch(err => logger.error('Email background error', { err }));
    }

    res.status(201).json({
      order: { id: orderId, total, status: 'pending', itemCount: validatedItems.length },
    });
  } catch (error: any) {
    logger.error('Create order error', { error: error.message });
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const userId = req.user!.userId;

    const result = db.exec("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId] as any);
    const orders = rowsToObjects(result);

    for (const order of orders) {
      const itemResult = db.exec(
        `SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
        [order.id] as any
      );
      order.items = rowsToObjects(itemResult);
    }

    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const submitContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;
    const db = getDb();

    db.run(
      `INSERT INTO contact_messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), name, email, subject, message]
    );
    saveDatabase();

    auditLog('CONTACT_MESSAGE', null, { email, subject });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
