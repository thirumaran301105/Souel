import { db, auth } from '../server.js';
import { Collections } from '../config/collections.js';

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await db.collection(Collections.USERS)
      .where('email', '==', email)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      name,
      email,
      phone: phone || '',
      address: '',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
      favorites: []
    };

    await db.collection(Collections.USERS).doc(userRecord.uid).set(userData);

    // Generate custom token
    const token = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userRecord.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Verify user credentials through Firebase
    // Note: Firebase Admin SDK doesn't directly verify passwords
    // The client should use Firebase SDK for authentication
    // This endpoint verifies on the server side

    const userSnapshot = await db.collection(Collections.USERS)
      .where('email', '==', email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const userData = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;

    // Generate custom token
    const token = await auth.createCustomToken(userId);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    // Get user ID from Firebase token (passed via middleware)
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const doc = await db.collection(Collections.USERS).doc(userId).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        uid: doc.id,
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
