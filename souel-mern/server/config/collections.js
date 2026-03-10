/**
 * Firestore Collections Definitions
 * These define the structure of data in Firestore
 */

export const Collections = {
  USERS: 'users',
  MENU_ITEMS: 'menuItems',
  ORDERS: 'orders'
};

// User Document Structure
export const userTemplate = {
  name: '',
  email: '',
  phone: '',
  address: '',
  role: 'customer', // customer or admin
  createdAt: new Date(),
  updatedAt: new Date(),
  favorites: [] // array of menu item IDs
};

// MenuItem Document Structure
export const menuItemTemplate = {
  name: '',
  description: '',
  category: 'coffee', // coffee, tea, pastry, snack, beverage
  price: 0,
  image: '☕',
  available: true,
  rating: 0,
  reviews: 0,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Order Document Structure
export const orderTemplate = {
  userId: '',
  items: [
    {
      menuItemId: '',
      menuItemName: '',
      quantity: 0,
      price: 0,
      specialRequests: ''
    }
  ],
  totalAmount: 0,
  orderType: 'dine-in', // dine-in, takeout, delivery
  status: 'pending', // pending, confirmed, preparing, ready, completed, cancelled
  deliveryAddress: '',
  notes: '',
  estimatedTime: 30,
  createdAt: new Date(),
  updatedAt: new Date()
};
