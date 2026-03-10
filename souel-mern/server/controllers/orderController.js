import { db } from '../server.js';
import { Collections } from '../config/collections.js';

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const snapshot = await db.collection(Collections.ORDERS)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = [];
    snapshot.forEach(doc => {
      orders.push({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      });
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection(Collections.ORDERS)
      .where('userId', '==', userId)
      .get();

    const orders = [];
    snapshot.forEach(doc => {
      orders.push({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      });
    });

    // Sort by createdAt in memory
    orders.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return timeB - timeA; // Descending order
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error in getUserOrders:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection(Collections.ORDERS).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const { userId, items, orderType, deliveryAddress, notes } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and items'
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (let item of items) {
      if (!item.menuItemId || !item.price) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item data'
        });
      }
      totalAmount += item.price * item.quantity;
    }

    const orderData = {
      userId,
      items,
      totalAmount,
      orderType: orderType || 'dine-in',
      status: 'pending',
      deliveryAddress: deliveryAddress || '',
      notes: notes || '',
      estimatedTime: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(Collections.ORDERS).add(orderData);
    const orderId = docRef.id;

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        _id: orderId,
        ...orderData
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const docRef = db.collection(Collections.ORDERS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderData = doc.data();

    await docRef.update({
      status,
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: {
        _id: id,
        ...orderData,
        status,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(Collections.ORDERS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await docRef.update({
      status: 'cancelled',
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        _id: id,
        ...doc.data(),
        status: 'cancelled',
        updatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
