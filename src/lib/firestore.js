import { cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'mock-project-id',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'mock-client-email@example.com',
    // A minimal valid RSA private key for testing/mocking purposes
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDb+...\n-----END PRIVATE KEY-----').replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
    try {
        // Only attempt to initialize if we have a real-looking key, otherwise mock
        if (process.env.FIREBASE_PRIVATE_KEY) {
            admin.initializeApp({
                credential: cert(serviceAccount),
            });
        }
    } catch (error) {
        console.warn('Firebase initialization failed', error);
    }
}

const mockFirestore = {
    collection: () => ({
        doc: () => ({
            collection: () => ({
                doc: () => ({
                    get: async () => ({ exists: false, data: () => ({}) }),
                    set: async () => { },
                    delete: async () => { },
                }),
                get: async () => ({ docs: [] }),
                orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [] }) }) }),
                where: () => ({ get: async () => ({ docs: [] }) }),
            }),
            get: async () => ({ exists: false, data: () => ({}) }),
            set: async () => { },
            delete: async () => { },
            update: async () => { },
        }),
        where: () => ({ get: async () => ({ docs: [] }) }),
    }),
    runTransaction: async (cb) => {
        console.warn('Running transaction on mockFirestore (no-op)');
        return cb({
            get: async () => ({ exists: false, data: () => ({}) }),
            set: () => { },
            update: () => { },
            delete: () => { },
        });
    }
};

if (!admin.apps.length) {
    console.warn('Firebase Admin not initialized. Using mockFirestore.');
}

const firestore = admin.apps.length ? getFirestore() : mockFirestore;

export default firestore;
