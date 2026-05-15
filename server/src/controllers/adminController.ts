import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../models/database';
import { logger, auditLog } from '../utils/logger';

const rowsToObjects = (result: any[]): Record<string, any>[] => {
  if (result.length === 0 || result[0].values.length === 0) return [];
  return result[0].values.map((row: any[]) => {
    const obj: Record<string, any> = {};
    result[0].columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj;
  });
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const users = db.exec("SELECT COUNT(*) FROM users");
    const orders = db.exec("SELECT COUNT(*) FROM orders");
    const products = db.exec("SELECT COUNT(*) FROM products");
    const revenue = db.exec("SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'completed'");

    res.json({
      totalUsers: users[0]?.values[0]?.[0] || 0,
      totalOrders: orders[0]?.values[0]?.[0] || 0,
      totalProducts: products[0]?.values[0]?.[0] || 0,
      totalRevenue: revenue[0]?.values[0]?.[0] || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const result = db.exec("SELECT id, email, username, role, is_locked, created_at FROM users ORDER BY created_at DESC");
    res.json({ users: rowsToObjects(result) });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const result = db.exec(`SELECT o.*, u.email, u.username FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`);
    res.json({ orders: rowsToObjects(result) });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDb();
    db.run("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);
    saveDatabase();
    auditLog('ORDER_STATUS_UPDATED', req.user!.userId, { orderId: id, status });
    res.json({ message: 'Order status updated' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, original_price, category, image_url, badge, platform, genre } = req.body;
    const db = getDb();
    const id = uuidv4();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    db.run(
      `INSERT INTO products (id, name, slug, description, price, original_price, category, image_url, badge, platform, genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, slug, description, price, original_price, category, image_url || '/api/placeholder/default', badge, platform, genre]
    );
    saveDatabase();
    auditLog('PRODUCT_CREATED', req.user!.userId, { productId: id, name });
    res.status(201).json({ id, slug });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = getDb();
    db.run("DELETE FROM products WHERE id = ?", [id]);
    saveDatabase();
    auditLog('PRODUCT_DELETED', req.user!.userId, { productId: id });
    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getAuditLogs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const result = db.exec("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100");
    res.json({ logs: rowsToObjects(result) });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get audit logs' });
  }
};

export const getMessages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const result = db.exec("SELECT * FROM contact_messages ORDER BY created_at DESC");
    res.json({ messages: rowsToObjects(result) });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
};
