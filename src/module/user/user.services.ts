import status from "http-status";
import AppError from "../../error/appError";
import { generateOtp } from "../../utils/generateOtp";
import { sendVerificationOtpToEmail } from "../../utils/sendEmail";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { createToken } from "../../utils/generateToken";
import { config } from "../../config";
import { Response } from "express";

const createUser = async (payload: IUser) => {
  const { name, email, password } = payload;

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const user = await User.create({
    name,
    email,
    otp,
    password,
    otpExpiresAt,
  });
  await sendVerificationOtpToEmail(email, otp);

  return user;
};

const getAllUser = () => {
  return User.find()
    .select("-password")
    .select("-isDeleted")
    .select("-isVerified")
    .select("-refreshToken")
    .select("-accessToken");
};
const getSingleUser = async (id: string) => {
  const result = await User.findById(id)
    .select("-password")
    .select("-isDeleted")
    .select("-isVerified")
    .select("-refreshToken")
    .select("-accessToken")
    .populate("addresses")
    .populate("products");
  if (!result) {
    throw new AppError("User not found", status.NOT_FOUND);
  }
  return result;
};

const verifyOtp = async (email: string, otp: number, res: Response) => {
  const user = await User.findOne({
    email,
    otp,
    otpExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Invalid OTP or OTP has expired", status.BAD_REQUEST);
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  const result = await user.save();

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

  return {
    accessToken,
    refreshToken,
    result,
  };
};

const resendOtp = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", status.BAD_REQUEST);
  }

  const newOtp = generateOtp();

  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  user.otp = newOtp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  await sendVerificationOtpToEmail(email, newOtp);

  return { message: "OTP resent successfully" };
};

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
  }).select("-password");
  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }
  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id).select("-password");
  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }
  return user;
};

export const UserServices = {
  createUser,
  verifyOtp,
  resendOtp,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
