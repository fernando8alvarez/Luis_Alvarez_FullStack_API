// Firebase Admin
import type { ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";

// Node.js
import * as dotenv from "dotenv";
import path from "path";
import { pathToFileURL } from "url";

dotenv.config();
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountPath) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT no está definida en el .env");
}
const serviceAccountUrl = pathToFileURL(path.resolve(serviceAccountPath)).href;
const serviceAccount = (await import(serviceAccountUrl, { assert: { type: "json" } })).default;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export const db = getFirestore();
export const auth = getAuth();
