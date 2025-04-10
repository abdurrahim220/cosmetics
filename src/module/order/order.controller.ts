import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { orderService } from "./order.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId as string;
  const result = await orderService.createOrder(id, req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId as string;
  const role = req.user?.role as string;
  const result = await orderService.getAllOrder(id, role, req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId =req.body.orderId;
  const id = req.user?.userId as string;
  const role = req.user?.role as string;
  const result = await orderService.cancelOrder(orderId,id, role, );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

export const orderController = {
  createOrder,
  getAllOrder,
  cancelOrder,
};
