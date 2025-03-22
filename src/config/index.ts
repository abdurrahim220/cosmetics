import dotenv from "dotenv";
import path from "path";
import { getEnvVar } from "../utils/getEnvVar";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: getEnvVar("PORT"),
  db: getEnvVar("DATABASE_ACCESS"),
  NODE_ENV: getEnvVar("NODE_ENV"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN"),
  JWT_REFRESH_TOKEN: getEnvVar("JWT_REFRESH_TOKEN"),
  JWT_ACCESS_TOKEN: getEnvVar("JWT_ACCESS_TOKEN"),
  EMAIL_USER: getEnvVar("EMAIL_USER"),
};
