import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { addressServices } from "./address.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const addOrUpdateAddress = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId as string;
//   console.log("req",  req.user?.userId);
  const result = await addressServices.addOrUpdateAddress(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Address added successfully",
    data: result,
  });
});

export const addressController = {
  addOrUpdateAddress,
};
