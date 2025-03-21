/* eslint-disable no-unused-vars */
import { Types, Model } from "mongoose";
import { UserRole, UserStatus } from "../../interface/sharedInterface";

export type IUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  passwordChangedAt?: Date;
  address?: Types.ObjectId;
  refreshToken?: string;
  otp?: number;
  otpExpiresAt?: Date;
  isVerified: boolean;
  accessToken?: string;
  isDeleted: boolean;
};

// Instance methods
export interface IUserMethods {
  isPasswordMatched(plainTextPassword: string): Promise<boolean>;
}

// Static methods
export interface IUserModel extends Model<IUser, object, IUserMethods> {
  isUserExistsByCustomId(id: string): Promise<IUser | null>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
