import type { FirebaseEmailData } from "../types/firebase.types.js";
import { db } from "../config/firebase.js";
import { admin } from "../config/firebase.js";

// Obtener un documento por ID
export const getDocument = async (ref: string, id: string) => {
  const docRef = db.collection(ref).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  return { ...doc.data(), id: doc.id };
};

// Obtener todos los documentos de una colección (opcional: con filtro simple)
export const getDocuments = async (
  ref: string,
  qry?: [string, FirebaseFirestore.WhereFilterOp, any]
) => {
  let query: FirebaseFirestore.Query = db.collection(ref);
  if (qry) {
    query = query.where(qry[0], qry[1], qry[2]);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

// Crear un documento (con o sin ID)
export const createDocument = async (ref: string, data: any, id?: string) => {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const docData = { ...data, createdAt: now, updatedAt: now };
  let docId: string;
  if (id) {
    await db.collection(ref).doc(id).set(docData);
    docId = id;
  } else {
    const docRef = await db.collection(ref).add(docData);
    docId = docRef.id;
  }
  // Leer el documento actualizado para obtener los timestamps reales
  return getDocument(ref, docId);
};

// Actualizar un documento
export const updateDocument = async (ref: string, id: string, data: any) => {
  const now = admin.firestore.FieldValue.serverTimestamp();
  await db
    .collection(ref)
    .doc(id)
    .update({ ...data, updatedAt: now });
  return getDocument(ref, id);
};

// Eliminar un documento
export const deleteDocument = async (ref: string, id: string) => {
  await db.collection(ref).doc(id).delete();
  return true;
};

// Buscar usuario por email (si usas Firebase Auth)
export const getUserByEmail = async (email: string) => {
  try {
    return await admin.auth().getUserByEmail(email);
  } catch (error: any) {
    if (error.code === "auth/user-not-found") return null;
    throw error;
  }
};

// Enviar email usando Firebase
export const sendFirebaseEmail = async (
  emailData: FirebaseEmailData
): Promise<boolean> => {
  try {
    await createDocument(`mail`, {
      from: process.env.EMAIL_FROM,
      to: emailData.to,
      message: {
        subject: emailData.message.subject,
        html: emailData.message.html,
        attachments: emailData?.attachments,
      },
    });
    return true;
  } catch (error) {
    console.error("Error sending Firebase email:", error);
    throw new Error("Error sending Firebase email");
  }
};
