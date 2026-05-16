import { Request, Response } from 'express';
import { getDb } from '../models/database';

const rowsToObjects = (result: any[]): Record<string, any>[] => {
  if (result.length === 0 || result[0].values.length === 0) return [];
  return result[0].values.map((row: any[]) => {
    const obj: Record<string, any> = {};
    result[0].columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj;
  });
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const { category, search, sort, brand, page = '1', limit = '12' } = req.query;

    let query = "SELECT * FROM products WHERE in_stock = 1";
    const params: any[] = [];

    if (category && typeof category === 'string') {
      query += " AND category = ?";
      params.push(category);
    }

    if (brand && typeof brand === 'string') {
      query += " AND brand = ?";
      params.push(brand);
    }

    if (search && typeof search === 'string') {
      query += " AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (sort === 'price_asc') query += " ORDER BY price ASC";
    else if (sort === 'price_desc') query += " ORDER BY price DESC";
    else if (sort === 'rating') query += " ORDER BY rating DESC";
    else if (sort === 'newest') query += " ORDER BY created_at DESC";
    else query += " ORDER BY featured DESC, rating DESC";

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const offset = (pageNum - 1) * limitNum;

    // Get total count
    let countQuery = "SELECT COUNT(*) as count FROM products WHERE in_stock = 1";
    const countParams: any[] = [];
    if (category && typeof category === 'string') {
      countQuery += " AND category = ?";
      countParams.push(category);
    }
    if (brand && typeof brand === 'string') {
      countQuery += " AND brand = ?";
      countParams.push(brand);
    }
    if (search && typeof search === 'string') {
      countQuery += " AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countResult = db.exec(countQuery, countParams as any);
    const total = countResult[0]?.values[0]?.[0] as number || 0;

    query += ` LIMIT ${limitNum} OFFSET ${offset}`;

    const result = db.exec(query, params as any);
    const products = rowsToObjects(result);

    // Get categories
    const catResult = db.exec("SELECT DISTINCT category FROM products WHERE in_stock = 1 ORDER BY category");
    const categories = catResult.length > 0 ? catResult[0].values.map((r: any[]) => r[0]) : [];

    // Get brands if category is specified
    let brands: string[] = [];
    if (category) {
      const brandResult = db.exec("SELECT DISTINCT brand FROM products WHERE category = ? AND brand IS NOT NULL ORDER BY brand", [category] as any);
      brands = brandResult.length > 0 ? brandResult[0].values.map((r: any[]) => r[0]) : [];
    }

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      categories,
      brands
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const result = db.exec("SELECT * FROM products WHERE featured = 1 AND in_stock = 1 ORDER BY rating DESC LIMIT 6");
    const products = rowsToObjects(result);
    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const db = getDb();
    const result = db.exec("SELECT * FROM products WHERE slug = ?", [slug] as any);
    const products = rowsToObjects(result);

    if (products.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product: products[0] });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = getDb();
    const result = db.exec("SELECT * FROM products WHERE id = ?", [id] as any);
    const products = rowsToObjects(result);

    if (products.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product: products[0] });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};
