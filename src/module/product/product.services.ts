/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../error/appError";
import { IProduct } from "./product.interface";
import { startSession } from "mongoose";
import { User } from "../user/user.model";
import { Product } from "./product.model";
import QueryBuilder from "../../builder/QueryBuilder";

const searchableFields = ["title", "desc", "brand", "whatsInBox"];


const createOrUpdateProduct = async (
  userId: string,
  payload: Partial<IProduct>
) => {
  if (!userId) {
    throw new AppError("User ID is required", status.NOT_FOUND);
  }

  const session = await startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    let product;

    if (payload._id) {
      product = await Product.findOneAndUpdate(
        { _id: payload._id, user: userId },
        payload,
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!product) {
        throw new AppError(
          "Product not found or you don’t have permission to update it",
          status.NOT_FOUND
        );
      }
    } else {
      product = (
        await Product.create([{ ...payload, user: userId }], { session })
      )[0];

      if (!user.products) {
        user.products = [];
      }
      if (!user.products.includes(product._id)) {
        user.products.push(product._id);
        await user.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return product;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteProduct = async (userId: string, productId: string) => {
  if (!userId) {
    throw new AppError("User ID is required", status.NOT_FOUND);
  }
  // console.log(productId)
  if (!productId) {
    throw new AppError("Product ID is required", status.BAD_REQUEST);
  }

  const session = await startSession();
  session.startTransaction();

  try {
    // Find the user
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    // Find and delete the product
    const product = await Product.findOneAndDelete(
      { _id: productId, user: userId },
      { session }
    );

    if (!product) {
      throw new AppError(
        "Product not found or you don’t have permission to delete it",
        status.NOT_FOUND
      );
    }

    // Remove the product ID from the user's products array (if it exists)
    if (user.products && user.products.length > 0) {
      const productIndex = user.products.indexOf(product._id);
      if (productIndex !== -1) {
        user.products.splice(productIndex, 1);
        await user.save({ session });
        //   console.log("User products array after deletion:", user.products);
      }
    }

    await session.commitTransaction();
    session.endSession();

    return { message: "Product deleted successfully", product };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllProducts = async (queryParams: Record<string, any> = {}) => {
  
  // console.log("getAllProducts Query Params:", queryParams); // Debug

  const queryBuilder = new QueryBuilder(Product, queryParams)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const products = await queryBuilder
    .query.populate("user", "name email")
    .lean();

  const meta = await queryBuilder.getPaginationMeta();

  return {
    data: products,
    meta,
  };
};




const getSellerProducts = async (
  userId?: string,
  queryParams: Record<string, any> = {}
) => {
  const baseQuery = userId ? { user: userId } : {};


  // const searchableFields = ["title", "desc", "brand", "whatsInBox"];
  const queryBuilder = new QueryBuilder(Product, {
    ...baseQuery,
    ...queryParams,
  })
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const products = await queryBuilder.query
    .populate("user", "name email")
    .lean();

  const meta = await queryBuilder.getPaginationMeta();

  return {
    data: products,
    meta,
  };
};

const getSingleProduct = async (productId: string) => {
  if (!productId) {
    throw new AppError("Product ID is required", status.BAD_REQUEST);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", status.NOT_FOUND);
  }

  return product;
};

export const productServices = {
  createOrUpdateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  getSellerProducts,
};
