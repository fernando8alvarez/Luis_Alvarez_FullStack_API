import ClientError from "../../utils/errors/index.js";
import { validateResult } from "../../middlewares/validateHelper.js";
import { check } from "express-validator";
import {
  getDocument,
  getUserByEmail,
} from "../../services/firestoreService.js";

export const get = [
  // Puedes agregar validaciones de query si lo necesitas
  validateResult,
];

export const getById = [
  check("id")
    .notEmpty()
    .withMessage(() => new ClientError("Must Not Be Empty", 400))
    .isString()
    .withMessage(() => new ClientError("Must Be A String", 422))
    .custom(async (value) => {
      const user = await getDocument("users", value);
      if (!user) throw new ClientError("User Not Found", 404);
      return true;
    }),
  validateResult,
];

export const post = [
  check("email")
    .notEmpty()
    .withMessage(() => new ClientError("Must Not Be Empty", 400))
    .isEmail()
    .withMessage(() => new ClientError("Must Be A Valid Email", 422))
    // .custom(async (value) => {
    //   const existingUser = await getUserByEmail(value);
    //   if (existingUser) throw new ClientError("Email Already Registered", 409);
    //   return true;
    // }),
    ,
  check("firstName")
    .notEmpty()
    .withMessage(() => new ClientError("Must Not Be Empty", 400))
    .isString()
    .withMessage(() => new ClientError("Must Be A String", 422)),
  check("lastName")
    .notEmpty()
    .withMessage(() => new ClientError("Must Not Be Empty", 400))
    .isString()
    .withMessage(() => new ClientError("Must Be A String", 422)),
  validateResult,
];

export const put = [
  check("id")
    .notEmpty()
    .withMessage(() => new ClientError("Must Not Be Empty", 400))
    .isString()
    .withMessage(() => new ClientError("Must Be A String", 422))
    .custom(async (value) => {
      const user = await getDocument("users", value);
      if (!user) throw new ClientError("User Not Found", 404);
      return true;
    }),
  check("firstName")
    .optional()
    .isString()
    .withMessage(() => new ClientError("Must Be A String", 422)),
  check("lastName")
    .optional()
    .isString()
    .withMessage(() => new ClientError("Must Be A String", 422)),
  validateResult,
];

export const deleteSchema = [
  check("id")
    .notEmpty()
    .withMessage(() => new ClientError("Must Not Be Empty", 400))
    .isString()
    .withMessage(() => new ClientError("Must Be A String", 422))
    .custom(async (value) => {
      const user = await getDocument("users", value);
      if (!user) throw new ClientError("User Not Found", 404);
      return true;
    }),
  validateResult,
];
