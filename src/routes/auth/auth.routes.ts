import { validateRefreshToken } from "../../middlewares/auth.js";
import * as authController from "./auth.controller.js";
import authSchema from "./auth.schema.js";
import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/auth/login", authSchema.postLogin, authController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/auth/logout", validateRefreshToken, authController.logout);

/**
 * @openapi
 * /auth/refreshToken:
 *   get:
 *     summary: Refresh JWT token
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Invalid refresh token
 */
router.get("/auth/refreshToken", validateRefreshToken, authController.refreshToken);

/**
 * @openapi
 * /auth/password-code:
 *   post:
 *     summary: Request password reset code
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code sent
 */
router.post("/auth/password-code", authController.passwordCode);

/**
 * @openapi
 * /auth/validate-code:
 *   post:
 *     summary: Validate password reset code
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code valid
 *       400:
 *         description: Invalid code
 */
router.post("/auth/validate-code", authController.validateVerificationCode);

export default router;
