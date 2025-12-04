// Server-side Firebase Admin SDK initialization
// Requires service account credentials in environment variables.
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Load service account from environment variables
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    // Only initialize if service account credentials exist
    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
  } catch (error) {
    console.warn('⚠️ Failed to initialize Firebase Admin SDK:', error.message);
  }
}

// Export initialized services
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage().bucket();

export default admin;