import { Router } from "express";
import { validateToken } from "../../middlewares/auth.js";
import * as usersController from "./users.controller.js";
import * as usersSchema from "./users.schemas.js";

const router = Router();

// ---------------------------------------- RUTAS ----------------------------------------
router.get("/users", validateToken, usersSchema.get, usersController.getUsers);
router.get("/users/:id", validateToken, usersSchema.getById, usersController.getUserById);
router.post("/users", usersSchema.post, usersController.postUser);
router.put("/users", validateToken, usersSchema.put, usersController.putUser);
router.delete("/users", validateToken, usersSchema.deleteSchema, usersController.deleteUser);

export default router;
