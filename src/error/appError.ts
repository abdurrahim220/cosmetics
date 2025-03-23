/* eslint-disable @typescript-eslint/no-explicit-any */
// class AppError extends Error {
//   public statusCode: number;
//   constructor(message: string, statusCode: number, stack = "") {
//     super(message);
//     this.statusCode = statusCode;
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

// export default AppError;

// appError.ts
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;
  public details?: any;

  constructor(
    message: string,
    statusCode: number,
    options: { code?: string; isOperational?: boolean; details?: any } = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = options.isOperational ?? true;
    this.code = options.code;
    this.details = options.details;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): {
    statusCode: number;
    message: string;
    code?: string;
    details?: any;
  } {
    return {
      statusCode: this.statusCode,
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, { code: "NOT_FOUND" });
  }
}

export class ValidationError extends AppError {
  public details?: Record<string, string>;
  constructor(
    message: string = "Validation failed",
    details?: Record<string, string>
  ) {
    super(message, 400, { code: "VALIDATION_FAILED" });
    this.details = details;
  }
}

export class DuplicateError extends AppError {
  constructor(message: string = "Duplicate key error") {
    super(message, 409, { code: "DUPLICATE_KEY" });
  }
}

export class CastError extends AppError {
  constructor(message: string = "Invalid data format") {
    super(message, 400, { code: "CAST_ERROR" });
  }
}

export default AppError;
