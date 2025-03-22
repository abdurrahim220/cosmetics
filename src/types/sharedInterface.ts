export type UserRole = "super-admin" | "admin" | "seller" | "buyer";

export type UserStatus = "in-progress" | "blocked" | "active";
 
export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }