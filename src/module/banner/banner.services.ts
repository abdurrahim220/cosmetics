import { IBanner } from "./banner.interface";
import { Banner } from "./banner.model";
import { User } from "../user/user.model";
import AppError from "../../error/appError";
import status from "http-status";
import { startSession } from "mongoose";

const createBanner = async (userId: string, payload: IBanner) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  const session = await startSession();
  try {
    session.startTransaction();

    const bannerData = { ...payload, user: userId };
    const [newBanner] = await Banner.create([bannerData], { session });

    await User.findByIdAndUpdate(
      userId,
      { $push: { banners: newBanner._id } },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    return newBanner;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const updateBanner = async (
  bannerId: string,
  payload: Partial<IBanner>,
  userId: string
) => {
  const banner = await Banner.findById(bannerId);
  if (!banner) {
    throw new AppError("Banner not found", status.NOT_FOUND);
  }
  if (banner.user.toString() !== userId) {
    throw new AppError(
      "You are not authorized to update this banner",
      status.UNAUTHORIZED
    );
  }

  const result = await Banner.findByIdAndUpdate(bannerId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteBanner = async (bannerId: string, userId: string) => {
  const banner = await Banner.findById(bannerId);
  if (!banner) {
    throw new AppError("Banner not found", status.NOT_FOUND);
  }
  if (banner.user.toString() !== userId) {
    throw new AppError(
      "You are not authorized to delete this banner",
      status.UNAUTHORIZED
    );
  }

  const session = await startSession();
  try {
    session.startTransaction();

    await User.findByIdAndUpdate(
      userId,
      { $pull: { banners: bannerId } },
      { new: true, session }
    );

    const result = await Banner.findByIdAndDelete(bannerId, { session });

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getRandomBanner = async () => {
  const [result] = await Banner.aggregate([{ $sample: { size: 1 } }]);
  if (!result) {
    throw new AppError("No banners available", status.NOT_FOUND);
  }
  return result;
};

const getAllBanner = async () => {
  // const result = await Banner.find();
  const result = await Banner.find();
  return result;
};

export const bannerServices = {
  createBanner,
  updateBanner,
  deleteBanner,
  getRandomBanner,
  getAllBanner,
};
 