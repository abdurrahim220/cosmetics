import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { wishlistService } from "./wishlist.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

const addToWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId as string;
  const { productId } = req.body;
  const result = await wishlistService.addToWishlist(userId, productId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product added to wishlist",
    data: result,
  });
});

const removeFromWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId as string;
  const { productId } = req.body;
  const result = await wishlistService.removeFromWishlist(userId, productId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product removed from wishlist",
    data: result,
  });
});

const getWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await wishlistService.getWishlist(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Wishlist retrieved successfully",
    data: result,
  });
});

export const wishlistController = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};