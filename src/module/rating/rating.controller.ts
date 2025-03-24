import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { ratingService } from "./rating.services";

const addOrUpdateRating = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId;
  const productId = req.params.productId;
  const result = await ratingService.addOrUpdateRating(id, req.body, productId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Rating added successfully",
    data: result,
  });
});

export const ratingController = {
  addOrUpdateRating,
};
