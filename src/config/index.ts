import dotenv from "dotenv";
import path from "path";
import { getEnvVar } from "../utils/getEnvVar";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: getEnvVar("PORT"),
  db: getEnvVar("DATABASE_ACCESS"),
  NODE_ENV: getEnvVar("NODE_ENV"),
};
