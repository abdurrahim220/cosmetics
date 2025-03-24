/* eslint-disable no-unused-vars */
import { Types, Model } from "mongoose";
import { UserRole, UserStatus } from "../../types/sharedInterface";

export type IUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  passwordChangedAt?: Date;
  addresses?: Types.ObjectId[];
  products?: Types.ObjectId[];
  refreshToken?: string;
  otp?: number;
  otpExpiresAt?: Date;
  isVerified: boolean;
  accessToken?: string;
  isDeleted: boolean;
};

// Instance methods
export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(id: string): Promise<IUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
