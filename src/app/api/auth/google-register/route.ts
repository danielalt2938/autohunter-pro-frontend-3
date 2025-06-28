import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin only if not already initialized
if (!getApps().length) {
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
      initializeApp({
        credential: cert({
          projectId: requiredEnvVars.projectId,
          clientEmail: requiredEnvVars.clientEmail,
          privateKey: requiredEnvVars.privateKey?.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
    }
  }
}

const auth = getAuth();
const db = getFirestore();

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user already exists in our database
    const userDoc = db.collection('users').doc(uid);
    const userSnapshot = await userDoc.get();

    if (userSnapshot.exists) {
      // User already exists, return success
      return NextResponse.json({ success: true, uid, isNewUser: false });
    }

    // Create new user document
    await userDoc.set({
      email: email,
      name: name || null,
      profilePicture: picture || null,
      role: "Free User",
      stripeId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      createdAt: Date.now(),
      provider: 'google'
    });

    return NextResponse.json({ success: true, uid, isNewUser: true });
  } catch (error) {
    console.error('Error registering Google user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred during Google registration' },
      { status: 400 }
    );
  }
} 