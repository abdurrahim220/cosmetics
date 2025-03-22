import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.services";

const loginUser = catchAsync(async (req, res) => {
  const login = await AuthService.loginUser(req.body,res);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Login Successfull",
    data: login,
  });
});
const logOutUser = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AuthService.logOutUser(userId);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logout Successfull",
    data: result,
  });
});
const resetUserPassword = catchAsync(async (req, res) => {});
const changeUserPassword = catchAsync(async (req, res) => {});
const refreshToken = catchAsync(async (req, res) => {});

export const AuthController = {
  loginUser,
  logOutUser,
  resetUserPassword,
  refreshToken,
  changeUserPassword,
};
