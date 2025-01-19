// lib/firebaseAdmin.ts
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    } as admin.ServiceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const firebaseAdmin = admin; 
