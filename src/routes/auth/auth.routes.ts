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
 *     description: Authenticates a user and returns a JWT token and refresh token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid password
 */
router.post("/auth/login", authSchema.postLogin, authController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user and invalidates the refresh token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               message: User logged out
 */
router.post("/auth/logout", validateRefreshToken, authController.logout);

/**
 * @openapi
 * /auth/refreshToken:
 *   get:
 *     summary: Refresh JWT token
 *     description: Returns a new JWT token using a valid refresh token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *       401:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid refresh token
 */
router.get(
  "/auth/refreshToken",
  validateRefreshToken,
  authController.refreshToken
);

/**
 * @openapi
 * /auth/password-code:
 *   post:
 *     summary: Request password reset code
 *     description: Sends a verification code to the user's email for password reset.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordCodeRequest'
 *           example:
 *             email: "user@example.com"
 *     responses:
 *       200:
 *         description: Code sent
 *         content:
 *           application/json:
 *             example:
 *               message: Código enviado
 */
router.post("/auth/password-code", authController.passwordCode);

/**
 * @openapi
 * /auth/validate-code:
 *   post:
 *     summary: Validate password reset code
 *     description: Validates the verification code and sends a password reset email if valid.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidateCodeRequest'
 *           example:
 *             email: "user@example.com"
 *             code: "a1b2c3"
 *     responses:
 *       200:
 *         description: Code valid
 *         content:
 *           application/json:
 *             example:
 *               message: Email enviado
 *       400:
 *         description: Invalid code
 *         content:
 *           application/json:
 *             example:
 *               message: Código inválido o expirado
 */
router.post("/auth/validate-code", authController.validateVerificationCode);

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *       example:
 *         email: "user@example.com"
 *         password: "password123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         tokenInfo:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             expiresIn:
 *               type: integer
 *       example:
 *         tokenInfo:
 *           token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *           expiresIn: 3600
 *     RefreshResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         expiresIn:
 *           type: integer
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         expiresIn: 3600
 *     PasswordCodeRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *       required:
 *         - email
 *       example:
 *         email: "user@example.com"
 *     ValidateCodeRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         code:
 *           type: string
 *       required:
 *         - email
 *         - code
 *       example:
 *         email: "user@example.com"
 *         code: "a1b2c3"

*/
export default router;
