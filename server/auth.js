import admin from 'firebase-admin';
import { db } from './firebaseAdmin.js';

/**
 * Verify JWT token sent from the frontend.
 */
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user data to request object
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Unauthorized - Invalid token' });
  }
};


// Dev 2
// This function is used to create or fetch a user in Firestore 

/**
 * Create or fetch user from Firestore on successful login.
 */
export const createOrFetchUser = async (user) => {
  try {
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        uid: user.uid,
        email: user.email,
        displayName: user.name || 'Anonymous',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('New user added to Firestore.');
    }

    return doc.exists ? doc.data() : user;
  } catch (error) {
    console.error('Error creating/fetching user:', error);
    throw error;
  }
};
