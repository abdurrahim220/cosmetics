import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { productServices } from "./product.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createOrUpdateProduct = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.user?.userId as string;
    const result = await productServices.createOrUpdateProduct(id, req.body);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  }
);

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId as string;
  //   console.log("userId",id)
  const { productId } = req.body;
  await productServices.deleteProduct(id, productId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product deleted successfully",
    data: null,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productServices.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All products retrieved successfully",
    data: result,
  });
});
const getSellerProducts = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId as string;

  const result = await productServices.getSellerProducts(id,req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: id
      ? "User's products retrieved successfully"
      : "All products retrieved successfully",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const result = await productServices.getSingleProduct(productId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

export const productController = {
  createOrUpdateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  getSellerProducts,
};
