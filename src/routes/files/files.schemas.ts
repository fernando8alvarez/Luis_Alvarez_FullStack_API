import { check } from "express-validator";
import ClientError from "../../utils/errors/index.js";
import { validateResult } from "../../middlewares/validateHelper.js";

export const putRenameFile = [
  check("oldKey")
    .notEmpty()
    .withMessage(() => new ClientError("oldKey is required", 400))
    .isString()
    .withMessage(() => new ClientError("oldKey must be a string", 422)),
  check("newKey")
    .notEmpty()
    .withMessage(() => new ClientError("newKey is required", 400))
    .isString()
    .withMessage(() => new ClientError("newKey must be a string", 422)),
  validateResult,
];
