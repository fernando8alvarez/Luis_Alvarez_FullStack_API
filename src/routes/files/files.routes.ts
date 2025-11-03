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
 *     description: Uploads a file to the S3 bucket. Requires authentication.
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/FileUploadRequest'
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               message: File uploaded
 *               key: "file-uuid-filename.pdf"
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             example:
 *               message: No file uploaded
 */
router.post("/upload", validateToken, upload.single("file"), uploadFile);

/**
 * @openapi
 * /download/{key}:
 *   get:
 *     summary: Download a file from S3
 *     description: Downloads a file from the S3 bucket by its key. Requires authentication.
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
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             example:
 *               message: File not found
 */
router.get("/download/:key", validateToken, downloadFile);

/**
 * @openapi
 * /rename:
 *   put:
 *     summary: Rename a file in S3
 *     description: Renames a file in the S3 bucket. Requires authentication.
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FileRenameRequest'
 *           example:
 *             oldKey: "old-file.pdf"
 *             newKey: "new-file.pdf"
 *     responses:
 *       200:
 *         description: File renamed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: File renamed
 *               oldKey: "old-file.pdf"
 *               newKey: "new-file.pdf"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid input
 */
router.put("/rename", validateToken, putRenameFile, renameFile);

/**
 * @openapi
 * /public-url/{key}:
 *   get:
 *     summary: Get a public URL for a file in S3
 *     description: Returns a signed public URL for a file in the S3 bucket. Requires authentication.
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
 *               $ref: '#/components/schemas/FilePublicUrlResponse'
 *             example:
 *               url: "https://localhost:4566/testing-bucket/file.pdf"
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             example:
 *               message: File not found
 */
router.get("/public-url/:key", validateToken, getPublicUrl);
/**
 * @openapi
 * components:
 *   schemas:
 *     FileUploadRequest:
 *       type: object
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *       required:
 *         - file
 *     FileRenameRequest:
 *       type: object
 *       properties:
 *         oldKey:
 *           type: string
 *         newKey:
 *           type: string
 *       required:
 *         - oldKey
 *         - newKey
 *     FilePublicUrlResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string

*/
export default router;
