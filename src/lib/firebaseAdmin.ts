import * as admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";

// Helper function to validate environment variables
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but is not set.`);
  }
  return value;
}

// Construct the service account object with camelCase keys
const serviceAccount: ServiceAccount = {
  projectId: getEnvVar("FIREBASE_PROJECT_ID"),
  privateKey: getEnvVar("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"), // Handle multiline keys
  clientEmail: getEnvVar("FIREBASE_CLIENT_EMAIL"),
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firebaseAdmin = admin;
