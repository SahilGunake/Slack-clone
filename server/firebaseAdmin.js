import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' with { type: "json" };


// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
