import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { bannerServices } from "./banner.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId as string;
  const result = await bannerServices.createBanner(id, req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Banner created successfully",
    data: result,
  });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId;
  const bannerId = req.params.id;
  const result = await bannerServices.updateBanner(bannerId, req.body, id);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Banner updated successfully",
    data: result,
  });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId;
  const bannerId = req.params.id;
  //   console.log(id,bannerId);
  await bannerServices.deleteBanner(bannerId, id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Banner deleted successfully",
    data: null,
  });
});
const getRandomBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerServices.getRandomBanner();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Random banner retrieved successfully",
    data: result,
  });
});
const getAllBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerServices.getAllBanner();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All banners retrieved successfully",
    data: result,
  });
});

export const bannerController = {
  createBanner,
  updateBanner,
  deleteBanner,
  getRandomBanner,
  getAllBanner,
};
