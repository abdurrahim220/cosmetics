import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.services";
import { Request, Response } from "express";

const loginUser = catchAsync(async (req, res) => {
  const login = await AuthService.loginUser(req.body, res);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Login Successfull",
    data: login,
  });
});

const logOutUser = catchAsync(async (req: Request, res) => {
  const id = req.user?.userId as string;
  const result = await AuthService.logOutUser(id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logout Successfull",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;
  const result = await AuthService.forgotPassword(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Otp send to your email",
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const { otp, password } = req.body;
  const result = await AuthService.resetPassword(otp, password);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password updated successfully",
    data: result,
  });
});

const changeUserPassword = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId as string;
  const { oldPassword, newPassword } = req.body;
  const result = await AuthService.changeUserPassword(
    id,
    oldPassword,
    newPassword
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password updated successfully",
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {});

export const AuthController = {
  loginUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  refreshToken,
  changeUserPassword,
};
