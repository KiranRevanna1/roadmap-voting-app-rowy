import * as admin from "firebase-admin";
import { getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseServiceAccount: { [key: string]: string } | null = process.env
  .SERVER_FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.SERVER_FIREBASE_SERVICE_ACCOUNT)
  : null;

export const firebaseClientConfig: { [key: string]: string } | null = process
  .env.CLIENT_FIREBASE_CONFIG
  ? JSON.parse(process.env.CLIENT_FIREBASE_CONFIG)
  : null;

let adminApp;
if (firebaseServiceAccount) {
  adminApp =
    getApps().length === 0
      ? admin.initializeApp({
          credential: admin.credential.cert({ ...firebaseServiceAccount }),
        })
      : getApp();
}

if (!adminApp) {
  throw new Error("Firebase application could not initialized!");
}

export const db = getFirestore(adminApp);
export const auth = admin.auth(adminApp);
