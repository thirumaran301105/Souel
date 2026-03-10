import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Firebase configuration - Replace with your config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnapshot = await getDoc(userDocRef);
          
          if (userSnapshot.exists()) {
            setUser({
              id: firebaseUser.uid,
              ...userSnapshot.data()
            });
            localStorage.setItem('token', await firebaseUser.getIdToken());
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (name, email, password, phone) => {
    try {
      // Create Firebase user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // Create user document in Firestore
      const userData = {
        uid: firebaseUser.uid,
        name,
        email,
        phone: phone || '',
        address: '',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
        favorites: []
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // Get ID token
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token);

      setUser({
        id: firebaseUser.uid,
        ...userData
      });

      return { success: true, user: { id: firebaseUser.uid, name, email, role: 'customer' } };
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // Sign in with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // Get user data from Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      const userData = userSnapshot.data();

      // Get ID token
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token);

      setUser({
        id: firebaseUser.uid,
        ...userData
      });

      return { success: true, user: { id: firebaseUser.uid, name: userData.name, email: userData.email, role: userData.role } };
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnapshot = await getDoc(userDocRef);

      let userData;
      if (!userSnapshot.exists()) {
        // Create new user document for Google sign-in
        userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || '',
          address: '',
          photoURL: firebaseUser.photoURL || '',
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
          favorites: []
        };
        await setDoc(userDocRef, userData);
      } else {
        userData = userSnapshot.data();
      }

      // Get ID token
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token);

      setUser({
        id: firebaseUser.uid,
        ...userData
      });

      return { success: true, user: { id: firebaseUser.uid, name: userData.name, email: userData.email, role: userData.role } };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, db, auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export { db, auth };
