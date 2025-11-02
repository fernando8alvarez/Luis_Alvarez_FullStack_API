import { Router } from "express";
import { validateToken } from "../../middlewares/auth.js";
import * as usersController from "./users.controller.js";
import * as usersSchema from "./users.schemas.js";

const router = Router();

// CRUD básico para usuarios
router.get("/users", usersSchema.get, usersController.getUsers);
router.get("/users/:id", usersSchema.getById, usersController.getUserById);
router.post("/users", usersSchema.post, usersController.postUser);
router.put("/users", usersSchema.put, usersController.putUser);
router.delete("/users", usersSchema.deleteSchema, usersController.deleteUser);

export default router;
