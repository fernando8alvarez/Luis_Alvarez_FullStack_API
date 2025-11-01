import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { Response } from "express";

dotenv.config();

const db = admin.firestore();
const secretKeyRefresh = process.env.JWT_REFRESH_SECRET as string;
const secretKeyJWT = process.env.JWT_SECRET as string;
const modo = process.env.MODO as string;

export const generateToken = async (data: any) => {
  const expiresIn = 60 * 20; // 20 minutos
  const token = jwt.sign(data, secretKeyJWT, { expiresIn });
  const expirationDate = new Date(Date.now() + expiresIn * 1000);
  return { expirationDate, token };
};

export const generateRefreshToken = async (
  data: any,
  res: Response,
  ref: string,
  indefiniteTime = false
) => {
  if (!indefiniteTime) {
    const expiresIn = 60 * 60 * 24 * 30; // 30 días
    const refreshToken = jwt.sign(data, secretKeyRefresh, { expiresIn });
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    const dataWithExpiration = { ...data, expirationDate, refreshToken };
    delete dataWithExpiration.id;
    delete dataWithExpiration.role;
    await db.collection(ref).add(dataWithExpiration);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: modo !== "local" ? true : false,
      sameSite: modo !== "local" ? "none" : "lax",
      maxAge: expiresIn * 1000,
    });

    return { refreshToken, expirationDate };
  }

  const refreshToken = jwt.sign(data, secretKeyRefresh);
  const dataNormal = { ...data, refreshToken, expirationDate: "indefinite" };
  delete dataNormal.id;
  delete dataNormal.role;
  await db.collection(ref).add(dataNormal);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: modo === "production" || modo === "development" ? true : false,
    sameSite: "none",
  });

  return { refreshToken, expirationDate: "indefinite" };
};

export const destroyToken = async (ref: string, id: string, res: Response) => {
  res.clearCookie("refreshToken");
  await db.collection(ref).doc(id).delete();
  return true;
};
