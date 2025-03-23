import status from "http-status";
import AppError from "../../error/appError";
import { IAddress } from "./address.interface";
import { startSession } from "mongoose";
import { User } from "../user/user.model";
import { Address } from "./address.model";

const addOrUpdateAddress = async (
  userId: string,
  payload: Partial<IAddress>
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

    let address = await Address.findOne({ user: userId }).session(session);

    if (address) {
      address = await Address.findOneAndUpdate({ user: userId }, payload, {
        new: true,
        runValidators: true,
        session,
      });
    } else {
      address = (
        await Address.create([{ ...payload, user: userId }], { session })
      )[0];

      if (!user.address) {
        user.address = [];
      }
      user.address.push(address._id);
      await user.save({ session });
    //   console.log("User address array after save:", user.address);
    }

    await session.commitTransaction();
    session.endSession();

    return address;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const addressServices = {
  addOrUpdateAddress,
};
