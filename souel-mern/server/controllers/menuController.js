import { db } from '../server.js';
import { Collections } from '../config/collections.js';

// Get all menu items
export const getMenuItems = async (req, res) => {
  try {
    const { category } = req.query;
    let query = db.collection(Collections.MENU_ITEMS);

    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    const menuItems = [];

    snapshot.forEach(doc => {
      menuItems.push({
        _id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single menu item
export const getMenuItemById = async (req, res) => {
  try {
    const doc = await db.collection(Collections.MENU_ITEMS).doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create menu item (admin only)
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, image, available } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const menuItemData = {
      name,
      description,
      category,
      price: parseFloat(price),
      image: image || '☕',
      available: available !== false,
      rating: 0,
      reviews: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(Collections.MENU_ITEMS).add(menuItemData);

    res.status(201).json({
      success: true,
      data: {
        _id: docRef.id,
        ...menuItemData
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update menu item (admin only)
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Remove _id from update data if present
    delete updateData._id;

    const docRef = db.collection(Collections.MENU_ITEMS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await docRef.update(updateData);

    res.status(200).json({
      success: true,
      data: {
        _id: id,
        ...doc.data(),
        ...updateData
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete menu item (admin only)
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(Collections.MENU_ITEMS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await docRef.delete();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Seed menu items (for development)
export const seedMenuItems = async (req, res) => {
  try {
    const sampleMenuItems = [
      {
        name: 'Espresso',
        description: 'Strong Italian coffee',
        category: 'coffee',
        price: 2.5,
        image: '☕',
        available: true
      },
      {
        name: 'Cappuccino',
        description: 'Creamy coffee with steamed milk',
        category: 'coffee',
        price: 4.0,
        image: '☕',
        available: true
      },
      {
        name: 'Latte',
        description: 'Smooth and creamy coffee drink',
        category: 'coffee',
        price: 4.5,
        image: '☕',
        available: true
      },
      {
        name: 'Green Tea',
        description: 'Fresh and refreshing green tea',
        category: 'tea',
        price: 2.0,
        image: '🍵',
        available: true
      },
      {
        name: 'Black Tea',
        description: 'Classic black tea with rich flavor',
        category: 'tea',
        price: 2.0,
        image: '🍵',
        available: true
      },
      {
        name: 'Herbal Tea',
        description: 'Assorted herbal tea blends',
        category: 'tea',
        price: 2.5,
        image: '🍵',
        available: true
      },
      {
        name: 'Croissant',
        description: 'Buttery French pastry',
        category: 'pastry',
        price: 3.5,
        image: '🥐',
        available: true
      },
      {
        name: 'Chocolate Eclair',
        description: 'Delicious chocolate pastry',
        category: 'pastry',
        price: 4.5,
        image: '🍰',
        available: true
      },
      {
        name: 'Blueberry Muffin',
        description: 'Fresh blueberry muffin',
        category: 'pastry',
        price: 3.0,
        image: '🧁',
        available: true
      },
      {
        name: 'Almonds',
        description: 'Roasted almonds',
        category: 'snack',
        price: 2.5,
        image: '🥜',
        available: true
      },
      {
        name: 'Cheese & Crackers',
        description: 'Assorted cheese with crackers',
        category: 'snack',
        price: 4.0,
        image: '🧀',
        available: true
      },
      {
        name: 'Brownie',
        description: 'Rich chocolate brownie',
        category: 'snack',
        price: 3.5,
        image: '🍫',
        available: true
      }
    ];

    const menuCollection = db.collection(Collections.MENU_ITEMS);
    let addedCount = 0;

    for (const item of sampleMenuItems) {
      const itemData = {
        ...item,
        rating: 0,
        reviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await menuCollection.add(itemData);
      addedCount++;
    }

    res.status(201).json({
      success: true,
      message: `${addedCount} menu items added successfully`,
      data: sampleMenuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
