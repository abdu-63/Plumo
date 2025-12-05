import { cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

let serviceAccount;

if (process.env.GOOGLE_SERVICE_KEY) {
    try {
        const parsed = JSON.parse(process.env.GOOGLE_SERVICE_KEY);
        serviceAccount = {
            projectId: parsed.project_id || parsed.projectId,
            clientEmail: parsed.client_email || parsed.clientEmail,
            privateKey: parsed.private_key || parsed.privateKey
        };
    } catch (e) {
        console.error('Failed to parse GOOGLE_SERVICE_KEY', e);
    }
} else {
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
    };
}

if (serviceAccount && serviceAccount.privateKey) {
    // Handle escaped newlines in private key
    serviceAccount.privateKey = serviceAccount.privateKey.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
    try {
        if (serviceAccount && serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
            admin.initializeApp({
                credential: cert(serviceAccount),
            });
            console.log('✅ Firestore Admin initialized successfully');
        } else {
            console.warn('Missing Firebase Admin credentials. Using mock.');
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
