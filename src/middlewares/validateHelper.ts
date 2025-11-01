import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (error: any) {
    // Array de errores capturados por express-validator
    const errorArray = error.array().map((e: any) => {
      return {
        ...e,
        msg: typeof e.msg === "object" && e.msg.message ? e.msg.message : e.msg,
        status: e.msg.statusCode || 422,
      };
    });

    // Agrupar errores por status code
    const groupedErrors: Record<number, any[]> = errorArray.reduce(
      (acc: Record<number, any[]>, curr: any) => {
        const status = curr.status;
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(curr);
        return acc;
      },
      {}
    );

    const priorityOrder = [500, 401, 403, 400, 404, 409, 422];
    const sortedGroupedErrors: Record<number, any[]> = {};

    // Ordenar errores por prioridad
    priorityOrder.forEach((status) => {
      if (groupedErrors[status]) {
        sortedGroupedErrors[status] = groupedErrors[status];
      }
    });

    // Enviar respuesta con el error de mayor prioridad
    const highestPriorityStatus =
      priorityOrder.find((status) => sortedGroupedErrors[status]) || 422;

    res.status(highestPriorityStatus).send({
      meta: {
        error: true,
        status: res.statusCode,
        url: req.protocol + "://" + req.get("host") + req.url,
        message: sortedGroupedErrors,
      },
    });
  }
};
