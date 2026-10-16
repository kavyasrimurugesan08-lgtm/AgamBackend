const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent JSON Database file
const DB_FILE = path.join(__dirname, 'database.json');

// Initial seed data
const initialData = {
  categories: [
    { id: 'sarees', name: 'Sarees', tamilName: 'புடவைகள்', slug: 'sarees', description: 'Heirloom Kanchipuram mulberry silks, Banarasi brocades, and soft silks.' },
    { id: 'kurtis', name: 'Kurtis', tamilName: 'குர்திகள்', slug: 'kurtis', description: 'Handcrafted Anarkalis, flared kurtas, and festive tunics.' },
    { id: 'salwar-suits', name: 'Salwar Suits', tamilName: 'சல்வார் சூட்கள்', slug: 'salwar-suits', description: 'Three-piece sets with rich dupattas and zardozi work.' },
    { id: 'mens-wear', name: "Men's Wear", tamilName: 'ஆண்கள் ஆடை', slug: 'mens-wear', description: 'Pure silk dhotis, Kasavu Mayilkanmu borders, and kurta sets.' },
    { id: 'kids-wear', name: "Kids' Wear", tamilName: 'குழந்தைகள் ஆடை', slug: 'kids-wear', description: 'Traditional Pattu Pavadai sets and boys dhoti kurtas.' },
    { id: 'blouses', name: 'Blouses', tamilName: 'ரவிக்கை', slug: 'blouses', description: 'Intricately embroidered readymade silk blouses.' },
    { id: 'lehengas', name: 'Lehengas', tamilName: 'லெஹங்கா', slug: 'lehengas', description: 'Opulent bridal lehengas with authentic zari and pearls.' },
    { id: 'dresses', name: 'Dresses', tamilName: 'வடிவமைப்பு ஆடைகள்', slug: 'dresses', description: 'Contemporary Indo-western silhouettes in handloom textiles.' }
  ],
  products: [
    {
      id: 'AGAM-KUR-01',
      sku: 'NT-KUR-3899',
      name: 'Chanderi Silk Flared Kurta Set',
      tamilName: 'சந்தேரி சில்க் அனார்கலி குர்தா',
      category: 'Kurtis',
      categorySlug: 'kurtis',
      subcategory: 'Anarkali Kurtis',
      price: 3899,
      originalPrice: 4999,
      discount: 22,
      rating: 4.9,
      reviewCount: 48,
      isBestseller: true,
      isNew: false,
      isFestive: true,
      inStock: true,
      stockCount: 14,
      fabrics: 'Chanderi Silk with Zardozi & Gota Patti',
      weave: 'Hand-woven artisan craft',
      colors: ['Mint Green', 'Ivory Cream', 'Blush Pink'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      description: 'Adorned with opulent silver gota patti and delicate zardozi needlework.',
      origin: 'Nirmala Atelier, Tamil Nadu'
    },
    {
      id: 'AGAM-SAR-01',
      sku: 'NT-SAR-14500',
      name: 'Kanchipuram Pure Mulberry Silk Bridal Saree',
      tamilName: 'காஞ்சிபுரம் தூய பட்டு புடவை',
      category: 'Sarees',
      categorySlug: 'sarees',
      subcategory: 'Kanchipuram Silk Sarees',
      price: 14500,
      originalPrice: 18999,
      discount: 24,
      rating: 5.0,
      reviewCount: 62,
      isBestseller: true,
      isNew: true,
      isFestive: true,
      inStock: true,
      stockCount: 8,
      fabrics: '100% Pure Mulberry Silk with Genuine Tested Zari',
      weave: 'Korvai Double Warp Handloom',
      colors: ['Crimson Red', 'Royal Gold', 'Deep Emerald'],
      sizes: ['Free Size'],
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      description: 'Woven with certified Silk Mark purity in our ancestral looms.',
      origin: 'Kanchipuram Master Weavers, Nirmala Tex'
    },
    {
      id: 'AGAM-MEN-01',
      sku: 'NT-MEN-5299',
      name: 'Royal Mulberry Silk Kurta & Dhoti (Veshti) Set',
      tamilName: 'தூய பட்டு குர்தா மற்றும் வேஷ்டி',
      category: "Men's Wear",
      categorySlug: 'mens-wear',
      subcategory: 'Traditional Veshti and Dhoti',
      price: 5299,
      originalPrice: 6999,
      discount: 24,
      rating: 4.9,
      reviewCount: 31,
      isBestseller: true,
      isNew: false,
      isFestive: true,
      inStock: true,
      stockCount: 15,
      fabrics: '100% Pure Raw Mulberry Silk with Kasavu Mayilkanmu Border',
      weave: 'Handcrafted Powerloom Silk',
      colors: ['Classic Ivory Gold', 'Cream Sand'],
      sizes: ['38', '40', '42', '44'],
      image: 'https://images.unsplash.com/photo-1610030469850-255e347e0964?auto=format&fit=crop&w=1000&q=85',
      description: 'Symbol of traditional South Indian dignity and timeless refinement.',
      origin: 'Nirmala Handloom Cluster'
    }
  ],
  orders: [
    {
      id: 'AGAM-ORD-9021',
      date: '2026-10-12',
      status: 'Shipped',
      trackingNumber: 'DEL-AGAM-894109',
      courier: 'BlueDart Express',
      total: 3685,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      customerName: 'Kavya S.',
      customerPhone: '+91 98401 23456',
      city: 'Coimbatore',
      itemsCount: 1
    }
  ],
  coupons: [
    { code: 'AGAM10', discountPercent: 10, label: '10% Welcome Heritage Discount' },
    { code: 'FESTIVE500', flatDiscount: 500, minCart: 3000, label: '₹500 Flat Festive Discount' },
    { code: 'SILKMARK', discountPercent: 15, label: '15% Pure Silk Mark Discount' }
  ]
};

// Initialize DB if not present
function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return initialData;
  }
}

function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let db = loadDatabase();

// --- REST API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', brand: 'AGAM – The Unit of Nirmala Tex', timestamp: new Date() });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json(db.categories);
});

// Products: List with search and filtering
app.get('/api/products', (req, res) => {
  let result = [...db.products];
  const { category, search, minPrice, maxPrice, sort } = req.query;

  if (category && category !== 'all') {
    result = result.filter(p => p.categorySlug === category || p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.fabrics && p.fabrics.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter(p => p.price <= Number(maxPrice));
  }

  if (sort === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  res.json(result);
});

// Product by ID
app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Admin: Add Product
app.post('/api/products', (req, res) => {
  const newProduct = {
    ...req.body,
    id: `AGAM-PROD-${Date.now().toString().slice(-4)}`,
    sku: req.body.sku || `NT-${Date.now().toString().slice(-4)}`,
    rating: 5.0,
    reviewCount: 0
  };
  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

// Admin: Update Product
app.put('/api/products/:id', (req, res) => {
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  db.products[idx] = { ...db.products[idx], ...req.body };
  saveDatabase(db);
  res.json(db.products[idx]);
});

// Admin: Delete Product
app.delete('/api/products/:id', (req, res) => {
  db.products = db.products.filter(p => p.id !== req.params.id);
  saveDatabase(db);
  res.json({ message: 'Product archived successfully' });
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json(db.orders);
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: `AGAM-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Payment Confirmed',
    trackingNumber: `DEL-AGAM-${Math.floor(100000 + Math.random() * 900000)}`,
    courier: 'BlueDart Express',
    ...req.body
  };
  db.orders.unshift(newOrder);
  saveDatabase(db);
  res.status(201).json(newOrder);
});

// Admin: Update Order Status
app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = status;
  saveDatabase(db);
  res.json(order);
});

// Validate Coupon
app.post('/api/coupons/validate', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required' });
  const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid or expired coupon' });
  res.json({ valid: true, coupon });
});

// Admin: Executive Statistics
app.get('/api/admin/stats', (req, res) => {
  const totalRevenue = db.orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrders = db.orders.length;
  const totalProducts = db.products.length;
  const lowStock = db.products.filter(p => p.stockCount < 10);

  res.json({
    totalRevenue,
    totalOrders,
    totalProducts,
    registeredCustomers: 124,
    lowStockCount: lowStock.length,
    lowStockItems: lowStock,
    recentOrders: db.orders.slice(0, 5)
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`✨ AGAM – The Unit of Nirmala Tex Backend Server ✨`);
  console.log(`🚀 REST APIs running on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
