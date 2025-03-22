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

const getAllUser = catchAsync(async (req, res, next) => {
  const result = await UserServices.getAllUser();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res, next) => {
  const result = await UserServices.getSingleUser(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await UserServices.verifyOtp(email, otp, res);

  // res.cookie()
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OTP verified successfully",
    data: result,
  });
});

const resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const result = await UserServices.resendOtp(email);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OTP resent successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const result = await UserServices.updateUser(req.params.id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const result = await UserServices.deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User delete successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  verifyOtp,
  resendOtp,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
