import status from "http-status";
import AppError from "../../error/appError";
import { generateOtp } from "../../utils/generateOtp";
import { sendVerificationOtpToEmail } from "../../utils/sendEmail";
import { IUser } from "./user.interface";
import { User } from "./user.model";

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

const verifyOtp = async (email: string, otp: number) => {
  const user = await User.findOne({
    email,
    otp,
    otpExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Invalid OTP or OTP has expired", status.BAD_REQUEST);
  }

  // Mark the user as verified
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return { message: "Email verified successfully" };
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

export const UserServices = {
  createUser,
  verifyOtp,
  resendOtp,
};
