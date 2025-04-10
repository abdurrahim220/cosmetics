import status from "http-status";
import AppError from "../../error/appError";
import { User } from "../user/user.model";
import { ILoginUser } from "./auth.interface";
import { createToken } from "../../utils/generateToken";
import { config } from "../../config";
import { Response } from "express";
import { generateOtp } from "../../utils/generateOtp";
import {
  sendForgotPasswordOtpVerificationToEmail,
  sendWelcomeLoginEmail,
} from "../../utils/sendEmail";

import { getDeviceInfo } from "../../utils/deviceInfo";

const loginUser = async (payload: ILoginUser, res: Response, req: Request) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User is not found", status.NOT_FOUND);
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError("User is not found", status.NOT_FOUND);
  }
  const isVerified = user?.isVerified;
  if (!isVerified) {
    throw new AppError("Please verify your account", status.BAD_REQUEST);
  }
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError("User is blocked", status.FORBIDDEN);
  }

  const isPasswordMatched = await User.isPasswordMatched(
    password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError("Incorrect password", status.UNAUTHORIZED);
  }
  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const { accessToken } = createToken(jwtPayload, config.JWT_ACCESS_TOKEN, res);
  const { refreshToken } = createToken(
    jwtPayload,
    config.JWT_REFRESH_TOKEN,
    res
  );

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;

  await user.save();


    
  const userWithoutSensitiveFields = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    isVerified: user.isVerified,
  };

  const deviceInfo = getDeviceInfo(req);
  
  const device = `${deviceInfo.deviceType} (${deviceInfo.os}) using ${deviceInfo.browser}`;
  const location = deviceInfo.location;
  await sendWelcomeLoginEmail(email, user.name, device, new Date(), location);
  return {
    accessToken,
    refreshToken,
    result: userWithoutSensitiveFields,
  };
};

const logOutUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }
  user.accessToken = undefined;
  user.refreshToken = undefined;
  await user.save();
  return { message: "Logged out successfully" };
};

const forgotPassword = async (userId: string) => {
  const user = await User.findById({ _id: userId });

  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError("User has been deleted", status.NOT_FOUND);
  }
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError("This user is blocked ! !", status.FORBIDDEN);
  }

  const newOtp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  user.otp = newOtp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();
  await sendForgotPasswordOtpVerificationToEmail(user.email, newOtp);

  return { message: "OTP send successfully" };
};

const resetPassword = async (otp: number, newPassword: string) => {
  const user = await User.findOne({ otp }).exec();

  if (!user) {
    throw new AppError("Invalid OTP", status.BAD_REQUEST);
  }

  if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
    throw new AppError("OTP has expired", status.BAD_REQUEST);
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return { message: "Password reset successfully" };
};

const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId).select("+password").exec();

  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  const isPasswordMatched = await User.isPasswordMatched(
    currentPassword,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError("Incorrect current password", status.UNAUTHORIZED);
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

const refreshToken = () => {};

export const AuthService = {
  loginUser,
  logOutUser,
  resetPassword,
  forgotPassword,
  refreshToken,
  changeUserPassword,
};
