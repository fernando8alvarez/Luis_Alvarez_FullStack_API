import express from "express";
import type { Request, Response, NextFunction, Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ClientError } from "./utils/errors/index.js";
import { response } from "./utils/response.js";
// import usersRouter from "./modules/users/users.routes.js";
// import authRouter from "./modules/auth/auth.routes.js";

dotenv.config();

const createApp = (routes: Array<Express>) => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

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

  // Ruta para manejar 404
  app.use((req: Request, res: Response) => {
    throw new ClientError("404 Not Found", 404);
  });

  // Middleware de manejo de errores
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ClientError) {
      return response(res, req, err.statusCode, { error: err.message }, true);
    }
    response(res, req, 500, { error: "Internal Server Error" }, true);
  });

  return app;
};

// Rutas específicas (agrega tus routers aquí)
const appRouters: Array<Express> = [
  // usersRouter,
  // authRouter,
];

const app = createApp(appRouters);
const PORT = process.env.PORT || 4566;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
