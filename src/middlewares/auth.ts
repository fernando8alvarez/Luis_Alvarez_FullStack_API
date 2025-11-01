import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";
import { ClientError } from "../utils/errors/index.js";

dotenv.config();

const secretKeyRefresh = process.env.JWT_REFRESH_SECRET as string;
const secretKeyJWT = process.env.JWT_SECRET as string;
const key = process.env.KEY_FIREBASE as string;

// Middleware para validar el token JWT
export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers["authorization"] &&
    req.headers["authorization"].toString().split(" ")[1];

  try {
    if (!token) {
      throw new ClientError("Token not found", 401);
    }
    jwt.verify(token, secretKeyJWT, (err: any, decoded: any) => {
      if (err) {
        throw new ClientError("Invalid or expired token", 401);
      }
      (req as any).user = decoded;
      next();
    });
  } catch (err) {
    next(err);
  }
};

// Middleware para validar el refresh token
export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshTokenCookie = req.cookies?.refreshToken;

  try {
    if (!refreshTokenCookie) {
      throw new ClientError("Refresh token not found", 401);
    }

    jwt.verify(
      refreshTokenCookie,
      secretKeyRefresh,
      (err: any, decoded: any) => {
        if (err) {
          throw new ClientError("Invalid or expired token", 401);
        }
        (req as any).user = decoded;
        next();
      }
    );
  } catch (err) {
    next(err);
  }
};

// Middleware para autenticar con Firebase
export const authenticationWithFirebase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Hacer la solicitud a Firebase para autenticar al usuario
    const auth = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );

    const tokenAuth = auth.data.idToken;
    const decodedToken = await admin.auth().verifyIdToken(tokenAuth);
    const user = await admin.auth().getUser(decodedToken.uid);

    if (!user) {
      throw new ClientError("User not found", 404);
    }

    (req as any).user = {
      id: user.uid,
      ...user,
      ...user.customClaims,
    };

    next();
  } catch (err: any) {
    if (err.response && err.response.data) {
      if (
        err.response.data.error &&
        [
          "INVALID_PASSWORD",
          "EMAIL_NOT_FOUND",
          "INVALID_LOGIN_CREDENTIALS",
        ].includes(err.response.data.error.message)
      ) {
        return next(new ClientError("Invalid email or password", 401));
      }
    }

    return next(err);
  }
};
