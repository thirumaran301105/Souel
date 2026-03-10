import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const sampleMenuItems = [
  {
    name: 'Espresso',
    description: 'Rich and bold single shot of espresso',
    category: 'coffee',
    price: 100,
    image: '☕',
    available: true,
    rating: 4.5,
    reviews: 120
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with velvety steamed milk and foam',
    category: 'coffee',
    price: 120,
    image: '☕',
    available: true,
    rating: 4.7,
    reviews: 250
  },
  {
    name: 'Latte',
    description: 'Smooth espresso and steamed milk combination',
    category: 'coffee',
    price: 130,
    image: '☕',
    available: true,
    rating: 4.6,
    reviews: 300
  },
  {
    name: 'Americano',
    description: 'Espresso shots with hot water',
    category: 'coffee',
    price: 110,
    image: '☕',
    available: true,
    rating: 4.4,
    reviews: 180
  },
  {
    name: 'Macchiato',
    description: 'Espresso with a small amount of foam',
    category: 'coffee',
    price: 115,
    image: '☕',
    available: true,
    rating: 4.5,
    reviews: 95
  },

  // Tea Items (₹25-50)
  {
    name: 'Green Tea',
    description: 'Fresh and refreshing green tea',
    category: 'tea',
    price: 30,
    image: '🍵',
    available: true,
    rating: 4.3,
    reviews: 80
  },
  {
    name: 'Chamomile Tea',
    description: 'Calming herbal blend for relaxation',
    category: 'tea',
    price: 35,
    image: '🍵',
    available: true,
    rating: 4.4,
    reviews: 65
  },
  {
    name: 'Matcha Latte',
    description: 'Creamy matcha green tea with steamed milk',
    category: 'tea',
    price: 45,
    image: '🍵',
    available: true,
    rating: 4.6,
    reviews: 200
  },
  {
    name: 'Black Tea',
    description: 'Strong and aromatic black tea',
    category: 'tea',
    price: 30,
    image: '🍵',
    available: true,
    rating: 4.2,
    reviews: 70
  },

  // Pastry Items (₹80-100)
  {
    name: 'Croissant',
    description: 'Buttery and flaky French pastry',
    category: 'pastry',
    price: 85,
    image: '🥐',
    available: true,
    rating: 4.5,
    reviews: 150
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich and decadent chocolate layer cake',
    category: 'pastry',
    price: 100,
    image: '🍰',
    available: true,
    rating: 4.7,
    reviews: 210
  },
  {
    name: 'Cookies',
    description: 'Freshly baked cookies daily',
    category: 'pastry',
    price: 80,
    image: '🍪',
    available: true,
    rating: 4.4,
    reviews: 180
  },
  {
    name: 'Cheesecake',
    description: 'Creamy New York style cheesecake',
    category: 'pastry',
    price: 95,
    image: '🍰',
    available: true,
    rating: 4.8,
    reviews: 280
  },
  {
    name: 'Muffin',
    description: 'Blueberry muffin with a crumbly top',
    category: 'pastry',
    price: 90,
    image: '🧁',
    available: true,
    rating: 4.3,
    reviews: 120
  },
  {
    name: 'Cheese Cracker',
    description: 'Crispy cheese-flavored crackers',
    category: 'pastry',
    price: 70,
    image: '🧀',
    available: true,
    rating: 4.2,
    reviews: 95
  },

  // Snacks
  {
    name: 'Sandwich',
    description: 'Freshly made chicken and avocado sandwich',
    category: 'snack',
    price: 150,
    image: '🥪',
    available: true,
    rating: 4.5,
    reviews: 100
  },
  {
    name: 'Bagel with Cream Cheese',
    description: 'Toasted bagel with smooth cream cheese',
    category: 'snack',
    price: 120,
    image: '🥯',
    available: true,
    rating: 4.3,
    reviews: 75
  },
  {
    name: 'Almond',
    description: 'Premium roasted almonds per gram',
    category: 'snack',
    price: 25,
    image: '🌰',
    available: true,
    rating: 4.6,
    reviews: 110
  },

  // Beverages
  {
    name: 'Iced Coffee',
    description: 'Cold brewed coffee over ice',
    category: 'beverage',
    price: 120,
    image: '🧊',
    available: true,
    rating: 4.4,
    reviews: 160
  },
  {
    name: 'Smoothie',
    description: 'Mixed berry smoothie with yogurt',
    category: 'beverage',
    price: 130,
    image: '🥤',
    available: true,
    rating: 4.6,
    reviews: 190
  },
  {
    name: 'Chocolate',
    description: 'Rich and creamy premium chocolate',
    category: 'beverage',
    price: 100,
    image: '🍫',
    available: true,
    rating: 4.5,
    reviews: 140
  }
];

const seedDatabase = async () => {
  try {
    // Parse the private key - remove quotes and properly handle newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ?.replace(/"/g, '') // Remove quotes
      ?.replace(/\\n/g, '\n'); // Replace literal \n with actual newlines

    const credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    });

    admin.initializeApp({
      credential: credential
    });

    const db = admin.firestore();
    console.log('Connected to Firestore');

    // Clear existing menu items
    const collectionRef = db.collection('menuItems');
    const snapshot = await collectionRef.get();
    const batch = db.batch();
    
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('Cleared existing menu items');

    // Insert sample items
    let insertedCount = 0;
    for (const item of sampleMenuItems) {
      await collectionRef.add({
        ...item,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      insertedCount++;
    }

    console.log(`Successfully inserted ${insertedCount} menu items`);

    console.log('\nSample menu items created:');
    sampleMenuItems.forEach(item => {
      console.log(`- ${item.name} (${item.category}) - ₹${item.price}`);
    });

    // Close connection
    await admin.app().delete();
    console.log('\nDatabase seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
