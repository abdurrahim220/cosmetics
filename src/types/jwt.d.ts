import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "./sharedInterface";

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: UserRole;
  iat: number;
  exp: number;
}