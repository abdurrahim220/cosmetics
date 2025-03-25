/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../error/appError";
import { IOrder } from "./order.interface";
import { startSession } from "mongoose";
import { User } from "../user/user.model";
import { Address } from "../address/address.model";
import { Product } from "../product/product.model";
import { Order } from "./order.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createOrder = async (
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
        if (product.inStock < item.quantity) {
          throw new AppError("Product out of stock", status.BAD_REQUEST);
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

    await User.updateOne(
      { _id: userId },
      { $push: { orders: createOrder._id } },
      { session }
    );

    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.products },
        {
          $push: { orders: createOrder._id },
          $inc: { inStock: -item.quantity },
        },
        { session }
      );
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

const getAllOrder = async (
  userId: string,
  role: string,
  queryParams: Record<string, any> = {}
) => {
  const baseQuery: Record<string, any> = {};

  if (role === "buyer") {
    baseQuery.user = userId;
  } else if (role === "seller") {
    const sellerProducts = await Product.find({ user: userId }).select("_id");
    baseQuery["items.products"] = { $in: sellerProducts.map((p) => p._id) };
  }

  const searchableFields = ["orderId"];
  const queryBuilder = new QueryBuilder(Order, { ...baseQuery, ...queryParams })
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const orders = await queryBuilder.query
    .populate("user", "name email")
    .populate("items.products", "title brand originalPrice")
    .populate("shippingAddress", "street city country")
    .lean();

  const meta = await queryBuilder.getPaginationMeta();

  return { data: orders, meta };
};

const cancelOrder = async (orderId: string, userId: string, role: string) => {
  const session = await startSession();
  try {
    session.startTransaction();

    const order = await Order.findOne({ orderId }).session(session);

    if (!order) {
      throw new AppError("Order not found", status.NOT_FOUND);
    }

    if (role === "buyer" && order.user.toString() !== userId) {
      throw new AppError("Unauthorized to cancel this order", status.FORBIDDEN);
    } else if (role === "seller") {
      const sellerProducts = await Product.find({ user: userId }).select("_id");
      const orderProductIds = order.items.map((item) =>
        item.products._id.toString()
      );
      const isSellerOrder = orderProductIds.some((id) =>
        sellerProducts.some((p) => p._id.toString() === id)
      );
      if (!isSellerOrder) {
        throw new AppError(
          "Unauthorized to cancel this order",
          status.FORBIDDEN
        );
      }
    }

    if (order.status !== "pending") {
      throw new AppError(
        "Only pending orders can be canceled",
        status.BAD_REQUEST
      );
    }

    // Restore product stock and remove order reference
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.products._id },
        {
          $pull: { orders: order._id },
          $inc: { inStock: item.quantity },
        },
        { session }
      );
    }

    // Remove order reference from User
    await User.updateOne(
      { _id: order.user },
      { $pull: { orders: order._id } },
      { session }
    );
    order.status = "canceled";
    await order.save({ session });

    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error instanceof AppError
      ? error
      : new AppError("Failed to cancel order", status.INTERNAL_SERVER_ERROR);
  } finally {
    session.endSession();
  }
};

export const orderService = {
  createOrder,
  getAllOrder,
  cancelOrder,
};
