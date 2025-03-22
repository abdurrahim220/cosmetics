/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorDetail {
    path?: string;
    message: string;
  }
  
 export interface ErrorResponse {
    success: boolean;
    message: string;
    errorMessage: ErrorDetail[];
    stack?: string;
  }
  
 export interface MongooseError extends Error {
    name: string;
    code?: number;
    keyValue?: Record<string, any>;
    errors?: Record<string, { message: string; path: string }>;
    kind?: string;
    path?: string;
  }