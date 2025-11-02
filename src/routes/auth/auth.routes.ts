import { Router } from "express";
import * as authController from "./auth.controller.js";
import authSchema from "./auth.schema.js";
import { validateRefreshToken } from "../../middlewares/auth.js";

const router = Router();

// ---------------------------------------- RUTAS ----------------------------------------
router.post("/auth/login", authSchema.postLogin, authController.login);
router.post("/auth/logout", validateRefreshToken, authController.logout);
router.get("/auth/refreshToken", validateRefreshToken, authController.refreshToken);
router.post("/auth/password-code", authController.passwordCode);
router.post("/auth/validate-code", authController.validateVerificationCode);

export default router;
