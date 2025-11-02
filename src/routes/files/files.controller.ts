import type { Request, Response, NextFunction } from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import {
  s3,
  BUCKET,
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "../../services/s3Service.js";
import { v4 as uuidv4 } from "uuid";

const upload = multer({ storage: multer.memoryStorage() });

const downloadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { key } = req.params;
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const response = await s3.send(command);
  // Pipe el archivo al response
  (response.Body as any).pipe(res);
};

const renameFile = async (req: Request, res: Response, next: NextFunction) => {
  const { oldKey, newKey } = req.body;

  // Copiar el archivo al nuevo nombre
  await s3.send(
    new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${oldKey}`,
      Key: newKey,
    })
  );
  // Borrar el archivo original
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: oldKey }));
  res.json({ message: "File renamed", oldKey, newKey });
};

const getPublicUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { key } = req.params;
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  res.json({ url });
};

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const file = req.file;
  const fileKey = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3.send(new PutObjectCommand(params));
  res.status(201).json({ message: "File uploaded", key: fileKey });
};

export { upload, uploadFile, downloadFile, renameFile, getPublicUrl };
