import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { adminService } from "./adminServices";

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

const updateUserRole = catchAsync(async (req: AuthRequest, res: Response) => {
  const { userId, role } = req.body;
  const result = await adminService.updateUserRole(userId, role);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const { userId, userStatus } = req.body;
  const result = await adminService.updateUserStatus(userId, userStatus);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const verifyProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  const { productId, isVerified } = req.body;
  const result = await adminService.verifyProduct(productId, isVerified);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `Product ${isVerified ? "verified" : "unverified"} successfully`,
    data: result,
  });
});

const updateOrderStatus = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { orderId,  newStatus } = req.body;
    const result = await adminService.updateOrderStatus(
      orderId,
      newStatus,
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  }
);

export const adminController = {
  updateUserRole,
  updateUserStatus,
  verifyProduct,
  updateOrderStatus,
};
