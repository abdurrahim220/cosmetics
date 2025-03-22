import status from "http-status";
import AppError from "../../error/appError";
import { User } from "../user/user.model";
import { ILoginUser } from "./auth.interface";
import { createToken } from "../../utils/generateToken";
import { config } from "../../config";
import { Response } from "express";

const loginUser = async (payload: ILoginUser, res: Response) => {
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

const resetUserPassword = () => {};
const changeUserPassword = () => {};
const refreshToken = () => {};

export const AuthService = {
  loginUser,
  logOutUser,
  resetUserPassword,
  refreshToken,
  changeUserPassword,
};
