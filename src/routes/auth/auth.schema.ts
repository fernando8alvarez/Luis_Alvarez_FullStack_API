// Express
import type { Request, Response, NextFunction } from "express";
import type { ValidationChain } from "express-validator";
import { check } from "express-validator";

// Services
import { getUserByEmail } from "../../services/firestoreService.js";

// Middlewares
import { validateResult } from "../../middlewares/validateHelper.js";
import ClientError from "../../utils/errors/index.js";

export const authSchema: {
  postLogin: (
    | ValidationChain
    | ((req: Request, res: Response, next: NextFunction) => void)
  )[];
  passwordCode: (
    | ValidationChain
    | ((req: Request, res: Response, next: NextFunction) => void)
  )[];
  validateCode: (
    | ValidationChain
    | ((req: Request, res: Response, next: NextFunction) => void)
  )[];
} = {
  postLogin: [
    check("email")
      .notEmpty()
      .withMessage(() => new ClientError("EmailIsRequired", 400))
      .isEmail()
      .withMessage(() => new ClientError("MustBeAValidEmail", 422)),
    check("password")
      .notEmpty()
      .withMessage(() => new ClientError("PasswordIsRequired", 400))
      .isString()
      .withMessage(() => new ClientError("MustBeAString", 422)),
    (req: Request, res: Response, next: NextFunction) => {
      validateResult(req, res, next);
    },
  ],
  passwordCode: [
    check("email")
      .notEmpty()
      .withMessage(() => new ClientError("MustNotBeEmpty", 400))
      .isEmail()
      .withMessage(() => new ClientError("MustBeAValidEmail", 422))
      .custom(async (value) => {
        if (value) {
          const existingUser = await getUserByEmail(value);
          if (!existingUser) {
            throw new ClientError("UserNotFound", 404);
          }
        }
      }),
    (req: Request, res: Response, next: NextFunction) => {
      validateResult(req, res, next);
    },
  ],
  validateCode: [
    check("code")
      .notEmpty()
      .withMessage(() => new ClientError("MustNotBeEmpty", 400))
      .isString()
      .withMessage(() => new ClientError("MustBeAString", 422)),
    (req: Request, res: Response, next: NextFunction) => {
      validateResult(req, res, next);
    },
  ],
};

export default authSchema;
