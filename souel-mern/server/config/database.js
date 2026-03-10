import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
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
    console.log(`Firestore Connected: ${process.env.FIREBASE_PROJECT_ID}`);
    
    return { db, auth: admin.auth() };
  } catch (error) {
    console.error(`Firebase Error: ${error.message}`);
    process.exit(1);
  }
};

export default initializeFirebase;
