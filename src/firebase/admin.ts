import admin from "firebase-admin";

if (!admin.apps.length) {
  const requiredEnvVars = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  };

  // Check if all required environment variables are present
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn(`Missing Firebase Admin environment variables: ${missingVars.join(', ')}`);
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: requiredEnvVars.projectId,
          clientEmail: requiredEnvVars.clientEmail,
          privateKey: requiredEnvVars.privateKey?.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${requiredEnvVars.projectId}.firebaseio.com`,
      });
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
    }
  }
}

export const adminAuth = admin.auth();
export const firestore = admin.firestore();