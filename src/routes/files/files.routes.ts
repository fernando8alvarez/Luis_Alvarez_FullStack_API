import { validateToken } from "../../middlewares/auth.js";
import { putRenameFile } from "./files.schemas.js";
import { Router } from "express";
import {
  upload,
  uploadFile,
  downloadFile,
  renameFile,
  getPublicUrl,
} from "./files.controller.js";

const router = Router();

/**
 * @openapi
 * /upload:
 *   post:
 *     summary: Upload a file to S3
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 */
router.post("/upload", validateToken, upload.single("file"), uploadFile);

/**
 * @openapi
 * /download/{key}:
 *   get:
 *     summary: Download a file from S3
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: File key in S3
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: File not found
 */
router.get("/download/:key", validateToken, downloadFile);

/**
 * @openapi
 * /rename:
 *   put:
 *     summary: Rename a file in S3
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldKey:
 *                 type: string
 *               newKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: File renamed successfully
 *       400:
 *         description: Invalid input
 */
router.put("/rename", validateToken, putRenameFile, renameFile);

/**
 * @openapi
 * /public-url/{key}:
 *   get:
 *     summary: Get a public URL for a file in S3
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: File key in S3
 *     responses:
 *       200:
 *         description: Public URL generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       404:
 *         description: File not found
 */
router.get("/public-url/:key", validateToken, getPublicUrl);

export default router;
