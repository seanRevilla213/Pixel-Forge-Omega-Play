import type { Product } from '../types';
import xboxControllerImg from '../assets/xbox-360-controller.jpg';
import glowCyanImg from '../assets/glow-cyan.jpg';
import glowBlueImg from '../assets/glow-blue.jpg';
import glowGreenImg from '../assets/glow-green.jpg';
import glowPinkImg from '../assets/glow-pink.jpg';

import superlightGalleryImg from '../assets/pro-x-superlight-black-gallery-1.png';
import cs2DragonLoreImg from '../assets/wireless_mouse_cs2_dragon_lore_pdp_img_buy_01.png';
import hyperxAlphaImg from '../assets/hyperx_cloud_alpha_black_1_main.png';
import ps5ConsoleImg from '../assets/ps5-product-thumbnail-01-en-14sep21.png';
import mousepadImg from '../assets/qck_xxl_cs2_dragon_lore_pdp_img_buy_01.png';

export const productsData: Product[] = [
  {
    id: 'p1',
    name: 'Xbox 360 Wireless Controller',
    slug: 'xbox-360-wireless-controller',
    description: 'The iconic Xbox 360 Wireless Controller offers precision, comfort, and control. Featuring integrated 2.4 GHz high-performance wireless technology and a sleek ergonomic design.',
    price: 29.99,
    original_price: 39.99,
    category: 'Controllers',
    image_url: xboxControllerImg || '/products/xbox-360-controller.jpg',
    variants: JSON.stringify([
      { id: 'v1', name: 'Carbon Black', image_url: xboxControllerImg || '/products/xbox-360-controller.jpg', color: '#080808', glow: 'rgba(255, 255, 255, 0.15)' },
      { id: 'v2', name: 'Cyan', image_url: glowCyanImg || '/products/glow-cyan.jpg', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)' },
      { id: 'v3', name: 'Blue', image_url: glowBlueImg || '/products/glow-blue.jpg', color: '#0047AB', glow: 'rgba(0, 71, 171, 0.5)' },
      { id: 'v4', name: 'Green', image_url: glowGreenImg || '/products/glow-green.jpg', color: '#00ff41', glow: 'rgba(0, 255, 65, 0.5)' },
      { id: 'v5', name: 'Pink', image_url: glowPinkImg || '/products/glow-pink.jpg', color: '#ff00ff', glow: 'rgba(255, 0, 255, 0.6)' }
    ]),
    badge: 'CLASSIC',
    rating: 4.9,
    review_count: 5120,
    in_stock: 1,
    featured: 1,
    platform: 'PC, Xbox 360',
    genre: 'Input Device',
    brand: 'Xbox'
  },
  {
    id: 'p2',
    name: 'Redragon K670 Argo',
    slug: 'redragon-k670-argo',
    description: '75% Wireless Mechanical Keyboard with Gasket Mount and RGB lighting. Designed for the ultimate typing and gaming experience.',
    price: 89.99,
    original_price: 119.99,
    category: 'Mechanical Keyboards',
    image_url: 'https://m.media-amazon.com/images/I/71Yc0Y-K1NL._AC_SL1500_.jpg',
    variants: JSON.stringify([
      { id: 'v1', name: 'Argo Edition', image_url: 'https://m.media-amazon.com/images/I/71Yc0Y-K1NL._AC_SL1500_.jpg', color: '#ff8c00', glow: 'rgba(255, 140, 0, 0.4)' }
    ]),
    badge: 'NEW',
    rating: 4.8,
    review_count: 850,
    in_stock: 1,
    featured: 1,
    platform: 'PC, Mac',
    genre: 'Keyboard',
    brand: 'Redragon'
  },
  {
    id: 'p3',
    name: 'Logitech G Pro X Superlight',
    slug: 'logitech-g-pro-x-superlight',
    description: 'Ultra-lightweight wireless gaming mouse with HERO 25K sensor. Designed with top esports pros for maximum performance.',
    price: 149.99,
    original_price: null,
    category: 'Gaming Mouse',
    image_url: superlightGalleryImg || 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-black-gallery-1.png?v=1',
    variants: JSON.stringify([
      { id: 'v1', name: 'Superlight Black', image_url: superlightGalleryImg || 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-black-gallery-1.png?v=1', color: '#0f0f0f', glow: 'rgba(255, 255, 255, 0.2)' }
    ]),
    badge: 'ELITE',
    rating: 4.9,
    review_count: 12400,
    in_stock: 1,
    featured: 1,
    platform: 'PC',
    genre: 'Mouse',
    brand: 'Logitech'
  },
  {
    id: 'p4',
    name: 'CS2 Dragon Lore Wireless Mouse',
    slug: 'cs2-dragon-lore-wireless-mouse',
    description: 'Premium wireless gaming mouse featuring the legendary CS2 Dragon Lore skin design. Equipped with an ultra-low latency wireless connection and precision gaming sensor.',
    price: 189.99,
    original_price: null,
    category: 'Gaming Mouse',
    image_url: cs2DragonLoreImg || 'https://media.steelseriescdn.com/thumbs/catalog/items/63391/798402f12255476a80436d4df6c5478d.png.350x280_q100_crop-fit_optimize.png',
    variants: '[]',
    badge: 'DRAGON LORE',
    rating: 4.9,
    review_count: 8900,
    in_stock: 1,
    featured: 1,
    platform: 'PC, Mac, Linux',
    genre: 'Mouse',
    brand: 'SteelSeries'
  },
  {
    id: 'p5',
    name: 'HyperX Cloud Alpha',
    slug: 'hyperx-cloud-alpha',
    description: 'Durable aluminum frame, detachable cable, and dual chamber drivers for more distinction and less distortion. Designed for pro-level gaming comfort.',
    price: 99.99,
    original_price: null,
    category: 'Headsets',
    image_url: hyperxAlphaImg || 'https://hyperx.com/cdn/shop/products/hyperx_cloud_alpha_1_800x.png',
    variants: JSON.stringify([
      { id: 'v1', name: 'Alpha Edition', image_url: hyperxAlphaImg || 'https://hyperx.com/cdn/shop/products/hyperx_cloud_alpha_1_800x.png', color: '#ff3131', glow: 'rgba(255, 49, 49, 0.4)' }
    ]),
    badge: 'PRO CHOICE',
    rating: 4.8,
    review_count: 8500,
    in_stock: 1,
    featured: 1,
    platform: 'PC, PS5, Xbox, Switch',
    genre: 'Audio',
    brand: 'HyperX'
  },
  {
    id: 'p6',
    name: 'PlayStation 5 Console',
    slug: 'playstation-5',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
    price: 499.99,
    original_price: null,
    category: 'Consoles',
    image_url: ps5ConsoleImg || 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$',
    variants: JSON.stringify([
      { id: 'v1', name: 'Standard Edition', image_url: ps5ConsoleImg || 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$', color: '#ffffff', glow: 'rgba(255, 255, 255, 0.5)' }
    ]),
    badge: 'NEXT GEN',
    rating: 4.9,
    review_count: 45000,
    in_stock: 1,
    featured: 0,
    platform: 'PS5',
    genre: 'Console',
    brand: 'Sony'
  },
  {
    id: 'p7',
    name: 'SteelSeries Gaming Mouse Pad',
    slug: 'steelseries-gaming-mouse-pad',
    description: 'Elite cloth gaming mousepad with dynamic 2-zone RGB backlighting. The choice of esports pros for precision and control.',
    price: 59.99,
    original_price: null,
    category: 'Accessories',
    image_url: mousepadImg || 'https://media.steelseriescdn.com/thumbs/catalog/items/63391/798402f12255476a80436d4df6c5478d.png.350x280_q100_crop-fit_optimize.png',
    variants: '[]',
    badge: 'RGB ELITE',
    rating: 4.9,
    review_count: 12000,
    in_stock: 1,
    featured: 1,
    platform: 'Desktop',
    genre: 'Surface',
    brand: 'SteelSeries'
  }
];
