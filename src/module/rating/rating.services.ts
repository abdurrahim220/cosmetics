import { startSession } from "mongoose";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";
import { IRating } from "./rating.interface";
import { Rating } from "./rating.model";
import AppError from "../../error/appError";
import status from "http-status";

const addOrUpdateRating = async (
  userId: string,
  payload: Partial<IRating>,
  productId: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", status.NOT_FOUND);

  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", status.NOT_FOUND);

  const session = await startSession();
  session.startTransaction();
  try {
    let rating = await Rating.findOne({
      user: userId,
      product: productId,
    }).session(session);

    if (rating) {
      rating = await Rating.findOneAndUpdate(
        { user: userId, product: productId },
        { ...payload, name: user.name },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
    } else {
      rating = (
        await Rating.create(
          [
            {
              ...payload,
              user: userId,
              product: productId,
              name: payload.name || user.name,
            },
          ],
          { session }
        )
      )[0];
    }

    if (!rating)
      throw new AppError(
        "Failed to create or update rating",
        status.INTERNAL_SERVER_ERROR
      );

    if (!product.ratings) {
      product.ratings = [];
    }
    if (!product.ratings.includes(rating._id)) {
      product.ratings.push(rating._id);
      await product.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return rating;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const ratingService = {
  addOrUpdateRating,
};
