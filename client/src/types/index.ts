export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string;
  badge: string | null;
  rating: number;
  review_count: number;
  in_stock: number;
  featured: number;
  platform: string;
  genre: string;
  variants?: string; // JSON string of { name: string, image_url: string }[]
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shipping_address: string;
  payment_method: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  name?: string;
  image_url?: string;
}

export interface Session {
  id: string;
  device_info: string;
  ip_address: string;
  created_at: string;
  expires_at: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}
