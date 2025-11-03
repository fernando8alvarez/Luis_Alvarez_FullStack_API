// Express
import type { Request, Response, NextFunction, Router } from "express";
import express from "express";

// Otras dependencias
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

// Middlewares
import ErrorHandler from "./middlewares/errorHandler.js";
import ClientError from "./utils/errors/index.js";

// Rutas

import usersRouter from "./routes/users/users.routes.js";
import authRouter from "./routes/auth/auth.routes.js";
import filesRouter from "./routes/files/files.routes.js";

import { swaggerUi, swaggerSpec } from "./swagger.js";

dotenv.config();

const createApp = (routes: Router[]) => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  // Middleware para obtener la IP del cliente
  app.use((req: Request, res: Response, next: NextFunction) => {
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ??
      req.socket.remoteAddress ??
      "0.0.0.0";
    (req as any).clientIp = ip;
    next();
  });

  // Rutas modulares
  routes.forEach((router) => app.use(router));

  // Documentación Swagger (debe ir antes del 404)
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Ruta para manejar 404
  app.use((req: Request, res: Response) => {
    throw new ClientError("404 Not Found", 404);
  });

  // Middleware de errores
  app.use(ErrorHandler);

  return app;
};

// Rutas específicas (agrega tus routers aquí)
const appRouters: Router[] = [usersRouter, authRouter, filesRouter];

const app = createApp(appRouters);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
