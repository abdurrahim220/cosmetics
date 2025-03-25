import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { orderService } from "./order.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createOrUpdateOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId as string;
  const result = await orderService.createOrUpdateOrder(id, req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {});
const cancelOrder = catchAsync(async (req: Request, res: Response) => {});

export const orderController = {
  createOrUpdateOrder,
  getAllOrder,
  cancelOrder,
};
