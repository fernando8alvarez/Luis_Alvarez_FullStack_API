import { response, catchedAsync } from "../../utils/index.js";
import { admin } from "../../config/firebase.js";
import bcrypt from "bcryptjs";

import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../../services/firestoreService.js";

// Obtener todos los usuarios
export const getUsers = catchedAsync(async (req, res) => {
  const users = await getDocuments("users");
  return response(res, req, 200, users);
});

// Obtener usuario por ID
export const getUserById = catchedAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const user = await getDocument("users", id);
  return response(res, req, 200, user);
});

// Crear nuevo usuario
export const postUser = catchedAsync(async (req, res) => {
  const user = req.body;
  const { email, password, firstName, lastName } = user;

  // Crear usuario en Firebase Auth (contraseña en texto plano)
  const createdUserRecord = await admin.auth().createUser({
    email,
    password,
    displayName: `${firstName ?? ""} ${lastName ?? ""}`.trim(),
  });

  // Encriptar la contraseña para Firestore
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario en Firestore (con contraseña encriptada)
  const userData = { ...user };
  userData.password = hashedPassword;
  userData.id = createdUserRecord.uid;
  userData.createdAt = new Date();
  userData.updatedAt = new Date();
  const created = await createDocument(
    "users",
    userData,
    createdUserRecord.uid
  );

  return response(res, req, 201, {
    ...created,
    firebaseUid: createdUserRecord.uid,
  });
});

// Actualizar usuario
export const putUser = catchedAsync(async (req, res) => {
  const { id, firstName, lastName } = req.body as {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  const user = req.body;

  // Actualizar displayName en Firebase Auth si se proveen nombre o apellido
  if (firstName || lastName) {
    const displayName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    await admin.auth().updateUser(id, { displayName });
  }

  const updated = await updateDocument("users", id, user);
  return response(res, req, 200, updated);
});

// Eliminar usuario
export const deleteUser = catchedAsync(async (req, res) => {
  const { id } = req.body as { id: string };
  // Borrar usuario de Firebase Auth primero
  await admin.auth().deleteUser(id);
  // Luego borrar de Firestore
  await deleteDocument("users", id);
  return response(res, req, 200, { deleted: id });
});
