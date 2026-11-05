import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (typeof window !== "undefined" || process.env.NEXT_RUNTIME === "edge") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
export type { FirebaseApp, Auth, Firestore };

export const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "novapay-ledger-v1";
export const COLLECTIONS = {
  accounts: (uid: string) => `artifacts/${APP_ID}/users/${uid}/accounts`,
  trades: (uid: string) => `artifacts/${APP_ID}/users/${uid}/trades`,
  transactions: (uid: string) => `artifacts/${APP_ID}/users/${uid}/transactions`,
  settings: (uid: string) => `artifacts/${APP_ID}/users/${uid}/settings/lists`,
} as const;
