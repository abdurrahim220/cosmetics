/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// globalErrorHandler.ts
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { ZodError } from "zod";
import AppError, { ValidationError } from "../error/appError";
import { config } from "../config";
import { ErrorDetail, ErrorResponse, MongooseError } from "../types/errorInterface";



const globalErrorHandler = (
  err: Error | MongooseError | ZodError | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Something went wrong";
  let errorDetails: ErrorDetail[] = [];

  // Handle AppError subclasses
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = [{ path: req.originalUrl, message }];

    if (err instanceof ValidationError && err.details) {
      errorDetails = Object.entries(err.details).map(([path, msg]) => ({
        path,
        message: msg,
      }));
    }
  }
  // Handle Mongoose CastError
  else if (err.name === "CastError" && "kind" in err && "path" in err) {
    const castErr = err as MongooseError;
    statusCode = status.BAD_REQUEST;
    message = `Invalid ${castErr.kind} for ${castErr.path}`;
    errorDetails = [{ path: castErr.path, message: castErr.message }];
  }
  // Handle Mongoose Duplicate Key Error (MongoDB 11000)
  else if ("code" in err && (err as MongooseError).code === 11000) {
    const duplicateErr = err as MongooseError;
    const field = Object.keys(duplicateErr.keyValue || {})[0];
    const value = duplicateErr.keyValue?.[field];
    statusCode = status.CONFLICT;
    message = `Duplicate value '${value}' for field '${field}'`;
    errorDetails = [{ path: field, message }];
  }
  // Handle Mongoose ValidationError
  else if (err.name === "ValidationError" && "errors" in err) {
    const validationErr = err as MongooseError;
    statusCode = status.BAD_REQUEST;
    message = "Validation failed";
    errorDetails = Object.values(validationErr.errors || {}).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  }
  // Handle ZodError
  else if (err instanceof ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Validation failed";
    errorDetails = err.errors.map((e) => ({
      path: e.path.join(".") || req.originalUrl,
      message: e.message,
    }));
  }
  // Unhandled errors
  else {
    console.error(
      `Unhandled error: ${req.method} ${req.originalUrl}`,
      err.stack
    );
    errorDetails = [{ path: req.originalUrl, message }];
  }

  // Send typed response
  const response: ErrorResponse = {
    success: false,
    message,
    errorMessage: errorDetails,
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
