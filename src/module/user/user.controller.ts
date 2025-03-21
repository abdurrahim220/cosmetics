/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";

const createUser = catchAsync(async (req, res, next) => {
  const result = await UserServices.createUser(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await UserServices.verifyOtp(email, otp);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OTP verified successfully",
    data: result,
  });
});

const resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  console.log(email)
  const result = await UserServices.resendOtp(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OTP resent successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  verifyOtp,
  resendOtp
};
