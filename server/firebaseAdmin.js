import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' with { type: "json" };

const config = {
  credential: admin.credential.cert({
    projectId: process.env["FIREBASE_ADMIN_PROJECT_ID"],
    clientEmail: process.env["FIREBASE_ADMIN_CLIENT_EMAIL"],
    privateKey: process.env["FIREBASE_ADMIN_PRIVATE_KEY"].replace(/\\n/g, "\n"),
  }),
  // databaseURL: process.env.SVELTE_APP_FIREBASE_DATABASE_URL,
};


// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
