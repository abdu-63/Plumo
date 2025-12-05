import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // 1. On récupère la clé JSON complète depuis les variables d'environnement
    const serviceAccountStr = process.env.GOOGLE_SERVICE_KEY;

    if (serviceAccountStr) {
      // On parse le JSON
      const serviceAccount = JSON.parse(serviceAccountStr);

      // 2. Correction de sécurité pour la clé privée (gestion des sauts de ligne)
      // C'est crucial car Vercel gère parfois mal les '\n' dans les variables
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      // 3. Initialisation avec la méthode cert() moderne
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

      console.log('✅ Firebase Admin initialisé avec succès.');
    } else {
      // Si la variable n'existe pas, on log un avertissement clair
      console.warn('⚠️ Variable GOOGLE_SERVICE_KEY manquante dans Vercel.');
    }

  } catch (error) {
    console.error('⚠️ Erreur critique initialisation Firebase:', error);
  }
}

// 4. On garde vos exports exacts pour ne rien casser dans le reste du site
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

// Sécurité : on vérifie que storage est bien dispo avant d'exporter le bucket
export const adminStorage = admin.storage ? admin.storage().bucket() : null;

export default admin;