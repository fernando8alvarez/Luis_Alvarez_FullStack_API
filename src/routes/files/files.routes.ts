import { Router } from "express";
import { validateToken } from "../../middlewares/auth.js";
import {
  upload,
  uploadFile,
  downloadFile,
  renameFile,
  getPublicUrl,
} from "./files.controller.js";
import { putRenameFile } from "./files.schemas.js";

const router = Router();

// ---------------------------------------- RUTAS ----------------------------------------
router.post("/upload", validateToken, upload.single("file"), uploadFile);
router.get("/download/:key", validateToken, downloadFile);
router.put("/rename", validateToken, putRenameFile, renameFile);
router.get("/public-url/:key", validateToken, getPublicUrl);

export default router;
