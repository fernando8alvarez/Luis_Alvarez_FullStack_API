import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";
import ClientError from "../utils/errors/index.js";

dotenv.config();

const secretKeyRefresh = process.env.JWT_REFRESH_SECRET as string;
const secretKeyJWT = process.env.JWT_SECRET as string;

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
