// Interfaz para el usuario Firestore
interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  [key: string]: any;
}
// Middlewares
import { response, catchedAsync } from "../../utils/index.js";
import ClientError from "../../utils/errors/index.js";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

// FirestoreService
import {
  getDocument,
  getDocuments,
  updateDocument,
  sendFirebaseEmail,
} from "../../services/firestoreService.js";

// ServicesToken
import {
  generateToken,
  generateRefreshToken,
  destroyToken,
} from "../../services/tokenService.js";

// Templates
import generateVerificationEmail from "../../utils/templates/generateVerificationEmail.js";
import resetPassword from "../../utils/templates/resetPassword.js";

import { admin } from "../../config/firebase.js";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";

// ---------------------------------------- CONTROLLERS ----------------------------------------

export const login = catchedAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    throw new ClientError("Email and password are required", 400);
  }

  // Buscar usuario en Firestore por email

  const users = await getDocuments("users", ["email", "==", email]);
  const userFromDB = users[0] as User | undefined;
  if (!userFromDB || !userFromDB.password || !userFromDB.email) {
    throw new ClientError("User not found or missing fields", 404);
  }

  // Comparar contraseña
  const isMatch = await bcrypt.compare(password, userFromDB.password);

  if (!isMatch) {
    throw new ClientError("Invalid password", 401);
  }

  const ip =
    (req as any).clientIp ||
    req.get("x-forwarded-for") ||
    (req as any).connection?.remoteAddress;
  const userAgent = req.get("user-agent");

  const newStatus = true;
  const tokenInfo = await generateToken({
    id: userFromDB.id,
    email: userFromDB.email,
    metaData: {
      registeredIP: ip,
      userAgent,
    },
  });

  await generateRefreshToken(
    {
      id: userFromDB.id,
      email: userFromDB.email,
      metaData: {
        registeredIP: ip,
        userAgent,
      },
    },
    res,
    userFromDB.id
  );


  await updateDocument("users", userFromDB.id, {
    ...userFromDB,
    status: newStatus,
  });

  if ("id" in userFromDB) delete (userFromDB as any).id;
  if ("collections" in userFromDB) delete (userFromDB as any).collections;

  return response(res, req, 200, { tokenInfo });
});

export const logout = catchedAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const firstToken = (req as any).cookies?.refreshToken;

  const userFromDB = await getDocument("users", user.id);
  const authRecords = await getDocuments(`users/${user.id}/authentication`);

  const token = authRecords.find(
    (records: any) => records.refreshToken === firstToken
  );

  const newStatus = false;
  let newUserData = { ...userFromDB, status: newStatus };

  if ("id" in newUserData) delete (newUserData as any).id;
  if ("collections" in newUserData) delete (newUserData as any).collections;

  await updateDocument("users", user.id, newUserData);

  if (token) await destroyToken(user.id, token.id, res);

  return response(res, req, 200, {
    message: "User logged out",
  });
});

export const refreshToken = catchedAsync(
  async (req: Request, res: Response) => {
    const tokenInfo = { ...((req as any).user || {}) };

    delete tokenInfo.exp;
    delete tokenInfo.iat;

    const token = await generateToken({ ...tokenInfo });

    return response(res, req, 200, token);
  }
);

const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString("hex");
};

export const passwordCode = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  const user = await admin.auth().getUserByEmail(email);
  const verificationCode = generateVerificationCode();

  const emailCodeTemp = generateVerificationEmail(
    email,
    user,
    verificationCode
  );

  await sendFirebaseEmail(emailCodeTemp);

  // Guarda el código como clave con el email asociado
  await admin
    .firestore()
    .collection("verificationCodes")
    .doc(verificationCode)
    .set({
      email: email,
      createdAt: FieldValue.serverTimestamp(),
    });

  return response(res, req, 200, { message: "Código enviado" });
};

export const validateVerificationCode = async (req: Request, res: Response) => {
  const { code } = req.body as { code: string };

  const doc = await admin
    .firestore()
    .collection("verificationCodes")
    .doc(code)
    .get();

  if (!doc.exists) {
    throw new ClientError("El código no existe", 404);
  }

  const data = doc.data() as { email: string; createdAt: any };
  const now = new Date();
  const expirationTime = 10 * 60 * 1000; // 10 minutos

  if (now.getTime() - data.createdAt.toDate().getTime() > expirationTime) {
    throw new ClientError("Código inválido o expirado", 400);
  }

  const passwordResetLink = await admin
    .auth()
    .generatePasswordResetLink(data.email);

  const emailResetTemp = resetPassword(data.email, passwordResetLink);

  await sendFirebaseEmail(emailResetTemp);

  // Elimina el código después de usarlo
  await admin.firestore().collection("verificationCodes").doc(code).delete();

  return response(res, req, 200, { message: "Email enviado" });
};
