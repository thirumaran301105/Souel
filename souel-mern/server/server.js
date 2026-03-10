import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import initializeFirebase from './config/database.js';
import { Collections } from './config/collections.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Initialize Firebase
const { db: database, auth: authentication } = initializeFirebase();
export const db = database;
export const auth = authentication;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Firebase Auth Middleware
const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token && req.path !== '/api/auth/register' && req.path !== '/api/auth/login') {
    return next(); // Allow public routes
  }

  if (token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
    } catch (error) {
      console.log('Token verification failed (optional for public routes)');
    }
  }

  next();
};

app.use(verifyAuth);

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize menu items on startup
const initializeMenuItems = async () => {
  try {
    const snapshot = await db.collection(Collections.MENU_ITEMS).limit(1).get();
    
    if (snapshot.empty) {
      console.log('Initializing menu items...');
      
      const sampleItems = [
        {
          name: 'Espresso',
          description: 'Strong Italian coffee',
          category: 'coffee',
          price: 2.5,
          image: '☕',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Cappuccino',
          description: 'Creamy coffee with steamed milk',
          category: 'coffee',
          price: 4.0,
          image: '☕',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Latte',
          description: 'Smooth and creamy coffee drink',
          category: 'coffee',
          price: 4.5,
          image: '☕',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Green Tea',
          description: 'Fresh and refreshing green tea',
          category: 'tea',
          price: 2.0,
          image: '🍵',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Black Tea',
          description: 'Classic black tea with rich flavor',
          category: 'tea',
          price: 2.0,
          image: '🍵',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Herbal Tea',
          description: 'Assorted herbal tea blends',
          category: 'tea',
          price: 2.5,
          image: '🍵',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Croissant',
          description: 'Buttery French pastry',
          category: 'pastry',
          price: 3.5,
          image: '🥐',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Chocolate Eclair',
          description: 'Delicious chocolate pastry',
          category: 'pastry',
          price: 4.5,
          image: '🍰',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Blueberry Muffin',
          description: 'Fresh blueberry muffin',
          category: 'pastry',
          price: 3.0,
          image: '🧁',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Almonds',
          description: 'Roasted almonds',
          category: 'snack',
          price: 2.5,
          image: '🥜',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Cheese & Crackers',
          description: 'Assorted cheese with crackers',
          category: 'snack',
          price: 4.0,
          image: '🧀',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Brownie',
          description: 'Rich chocolate brownie',
          category: 'snack',
          price: 3.5,
          image: '🍫',
          available: true,
          rating: 0,
          reviews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const batch = db.batch();
      sampleItems.forEach(item => {
        const docRef = db.collection(Collections.MENU_ITEMS).doc();
        batch.set(docRef, item);
      });

      await batch.commit();
      console.log(`✅ ${sampleItems.length} menu items added successfully!`);
    } else {
      console.log('Menu items already exist');
    }
  } catch (error) {
    console.log('Error initializing menu items:', error.message);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeMenuItems();
});

export default app;
