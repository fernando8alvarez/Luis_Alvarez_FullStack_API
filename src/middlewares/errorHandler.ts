import type { Request, Response, NextFunction } from "express";

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;
  res.status(status).send({
    meta: {
      error: true,
      status,
      url: req.protocol + "://" + req.get("host") + req.url,
      message: err.message,
    },
  });
};

export default ErrorHandler;
