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
  SUPER_ADMIN_NAME: getEnvVar("SUPER_ADMIN_NAME"),
  SUPER_ADMIN_EMAIL: getEnvVar("SUPER_ADMIN_EMAIL"),
  SUPER_ADMIN_PASSWORD: getEnvVar("SUPER_ADMIN_PASSWORD"),
  SUPER_ADMIN_IMAGE: getEnvVar("SUPER_ADMIN_IMAGE"),
  SUPER_ADMIN_ROLE: getEnvVar("SUPER_ADMIN_ROLE"),
};
