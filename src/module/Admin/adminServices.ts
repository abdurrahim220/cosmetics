import status from "http-status";
import AppError from "../../error/appError";
import { User } from "../user/user.model";
import { Product } from "../product/product.model";
import { Order } from "../order/order.model";
import { startSession } from "mongoose";

const updateUserRole = async (userId: string, role: string) => {
  const validRoles = ["buyer", "seller", "admin", "super-admin"]; 
  if (!validRoles.includes(role)) {
    throw new AppError("Invalid role", status.BAD_REQUEST);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  if (user.role === "super-admin") {
    throw new AppError("Cannot modify super-admin role", status.FORBIDDEN);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  );
  return updatedUser;
};

const updateUserStatus = async (userId: string, userStatus: string) => {
  const validStatuses = ["active", "inactive", "banned"];
  if (!validStatuses.includes(userStatus)) {
    throw new AppError("Invalid status", status.BAD_REQUEST);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  if (user.role === "super-admin") {
    throw new AppError("Cannot modify super-admin status", status.FORBIDDEN);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { status: userStatus }, 
    { new: true, runValidators: true }
  );
  return updatedUser;
};

const verifyProduct = async (productId: string, isVerified: boolean) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", status.NOT_FOUND);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { isVerified },
    { new: true, runValidators: true }
  );
  return updatedProduct;
};

const updateOrderStatus = async (
  orderId: string,
  newStatus: string,
  sellerId?: string
) => {
  const validStatuses = ["pending", "shipped", "delivered", "canceled"];
  if (!validStatuses.includes(newStatus)) {
    throw new AppError("Invalid order status", status.BAD_REQUEST);
  }

  const session = await startSession();
  session.startTransaction();
  try {
    const order = await Order.findOne({ orderId }).session(session);
    if (!order) {
      throw new AppError("Order not found", status.NOT_FOUND);
    }

    
    if (sellerId) {
      const sellerProducts = await Product.find({ user: sellerId })
        .select("_id")
        .session(session);
      const orderProductIds = order.items.map((item) =>
        item.products.toString()
      );
      const isSellerOrder = orderProductIds.some((id) =>
        sellerProducts.some((p) => p._id.toString() === id)
      );
      if (!isSellerOrder) {
        throw new AppError(
          "Unauthorized to update this order",
          status.FORBIDDEN
        );
      }
    }

    
    if (order.status === "canceled" || order.status === "delivered") {
      throw new AppError(
        "Cannot update status of canceled or delivered order",
        status.BAD_REQUEST
      );
    }

    if (newStatus === "canceled" && order.status !== "pending") {
      throw new AppError(
        "Only pending orders can be canceled",
        status.BAD_REQUEST
      );
    }

    
    if (newStatus === "canceled") {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.products },
          { $inc: { inStock: item.quantity } },
          { session }
        );
      }
    }

    order.status = newStatus as
      | "pending"
      | "shipped"
      | "delivered"
      | "canceled";
    await order.save({ session });

    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error instanceof AppError
      ? error
      : new AppError(
          "Failed to update order status",
          status.INTERNAL_SERVER_ERROR
        );
  } finally {
    session.endSession();
  }
};

export const adminService = {
  updateUserRole,
  updateUserStatus,
  verifyProduct,
  updateOrderStatus,
};
