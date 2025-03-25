import status from "http-status";
import AppError from "../../error/appError";
// import { IWishlist } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";
import { startSession } from "mongoose";
import { Types } from "mongoose";

const addToWishlist = async (userId: string, productId: string) => {
  const session = await startSession();
  session.startTransaction();
  try {
    // Verify product exists
    const product = await Product.findById(productId).session(session);
    if (!product) {
      throw new AppError("Product not found", status.NOT_FOUND);
    }

    // Convert productId to ObjectId
    const productObjectId = new Types.ObjectId(productId);

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId }).session(session);
    if (!wishlist) {
      const newWishlist = {
        user: new Types.ObjectId(userId),
        items: [{ product: productObjectId }],
      };
      const createdWishlist = await Wishlist.create([newWishlist], { session });
      wishlist = createdWishlist[0];
    } else {
      // Check if product already exists in wishlist
      const exists = wishlist.items.some(
        (item) => item.product.toString() === productId
      );
      if (exists) {
        throw new AppError("Product already in wishlist", status.BAD_REQUEST);
      }
      wishlist.items.push({ product: productObjectId });
      await wishlist.save({ session });
    }

    // Update User with wishlist reference (always set, even if wishlist exists)
    await User.updateOne(
      { _id: userId },
      { $set: { wishlist: wishlist._id } },
      { session }
    );

    await session.commitTransaction();
    return wishlist;
  } catch (error) {
    await session.abortTransaction();
    throw error instanceof AppError ? error : new AppError("Failed to add to wishlist", status.INTERNAL_SERVER_ERROR);
  } finally {
    session.endSession();
  }
};

const removeFromWishlist = async (userId: string, productId: string) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const wishlist = await Wishlist.findOne({ user: userId }).session(session);
    if (!wishlist) {
      throw new AppError("Wishlist not found", status.NOT_FOUND);
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      throw new AppError("Product not found in wishlist", status.NOT_FOUND);
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save({ session });

    // If wishlist is empty, unset the reference in User but keep the wishlist document
    if (wishlist.items.length === 0) {
      await User.updateOne(
        { _id: userId },
        { $unset: { wishlist: "" } }, // Only remove the reference, not the wishlist
        { session }
      );
      // Optionally delete the wishlist document if you want it gone when empty
      // await Wishlist.deleteOne({ _id: wishlist._id }, { session });
    }

    await session.commitTransaction();
    return wishlist;
  } catch (error) {
    await session.abortTransaction();
    throw error instanceof AppError ? error : new AppError("Failed to remove from wishlist", status.INTERNAL_SERVER_ERROR);
  } finally {
    session.endSession();
  }
};

const getWishlist = async (userId: string) => {
  const wishlist = await Wishlist.findOne({ user: userId })
    .populate("items.product", "title brand originalPrice img")
    .lean();
  if (!wishlist) {
    return { user: userId, items: [] };
  }
  return wishlist;
};

export const wishlistService = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};