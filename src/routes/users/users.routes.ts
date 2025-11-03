import { Router } from "express";
import { validateToken } from "../../middlewares/auth.js";
import * as usersController from "./users.controller.js";
import * as usersSchema from "./users.schemas.js";

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all registered users. Requires authentication.
 *     tags:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *       example:
 *         id: "userId123"
 *         email: "user@example.com"
 *         name: "John Doe"
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Returns a user by their unique ID. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get(
  "/users/:id",
  validateToken,
  usersSchema.getById,
  usersController.getUserById
);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Registers a new user in the system.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *             name: "John Doe"
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 */
router.post("/users", usersSchema.post, usersController.postUser);

/**
 * @openapi
 * /users:
 *   put:
 *     summary: Update a user
 *     description: Updates an existing user's information. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *           example:
 *             id: "userId123"
 *             email: "user@example.com"
 *             name: "John Doe"
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 */
router.put("/users", validateToken, usersSchema.put, usersController.putUser);

/**
 * @openapi
 * /users:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDelete'
 *           example:
 *             id: "userId123"
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Invalid input
 */
router.delete(
  "/users",
  validateToken,
  usersSchema.deleteSchema,
  usersController.deleteUser
);
/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *       example:
 *         id: "userId123"
 *         email: "user@example.com"
 *         name: "John Doe"
 *     UserInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *       required:
 *         - email
 *         - password
 *         - name
 *       example:
 *         email: "user@example.com"
 *         password: "password123"
 *         name: "John Doe"
 *     UserUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *       required:
 *         - id
 *         - email
 *         - name
 *       example:
 *         id: "userId123"
 *         email: "user@example.com"
 *         name: "John Doe"
 *     UserDelete:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *       required:
 *         - id
 *       example:
 *         id: "userId123"
 */
export default router;
