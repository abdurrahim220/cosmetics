import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import AppError from "../error/appError";
import status from "http-status";

const validateRequest = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      const parsedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsedData.body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        next(
          new AppError("Validation failed", status.BAD_REQUEST, {
            details: errorMessage,
          })
        );
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
