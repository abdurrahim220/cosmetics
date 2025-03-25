import status from "http-status";
import AppError from "../../error/appError";
import { IOrder } from "./order.interface";
import { startSession } from "mongoose";
import { User } from "../user/user.model";
import { Address } from "../address/address.model";
import { Product } from "../product/product.model";
import { Order } from "./order.model";

const createOrUpdateOrder = async (
  userId: string,
  payload: Partial<IOrder>
) => {
  if (!userId) {
    throw new AppError("User not found", status.NOT_FOUND);
  }
  const session = await startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", status.NOT_FOUND);
    }
    // console.log("user", user.addresses);
    const address = await Address.findOne({ _id: user.addresses }).session(
      session
    );
    if (!address) {
      throw new AppError("Address not found", status.NOT_FOUND);
    }
    // console.log("address", address);

    const productIds = payload.items?.map((item) => item.products) || [];
    const products = await Product.find({
      _id: { $in: productIds },
    }).session(session);
    // console.log("products", products);

    if (products.length !== productIds.length) {
      throw new AppError("One or more Product not found", status.NOT_FOUND);
    }

    const orderItems =
      payload.items?.map((item) => {
        const product = products.find(
          (product) => product._id.toString() === item.products.toString()
        );
        if (!product) {
          throw new AppError("Product not found", status.NOT_FOUND);
        }
        return {
          products: product._id,
          price: product.originalPrice,
          quantity: item.quantity,
        };
      }) || [];

    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const orderData: Partial<IOrder> = {
      user: user._id,
      items: orderItems,
      totalPrice,
      orderId,
      shippingAddress: address._id,
    };
    const order = await Order.create([orderData], { session: session });
    const createOrder = order[0];

    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.products },
        { $inc: { inStock: -item.quantity } }
      ).session(session);
    }

    await session.commitTransaction();
    session.endSession();
    return createOrder;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getAllOrder = async () => {};
const cancelOrder = async () => {};

export const orderService = {
  createOrUpdateOrder,
  getAllOrder,
  cancelOrder,
};
