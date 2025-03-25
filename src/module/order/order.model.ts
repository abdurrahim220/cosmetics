import { model, Schema } from "mongoose";
import { IOrder, IOrderItem } from "./order.interface";

const orderItemSchema = new Schema<IOrderItem>({
  products: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
});

// const shippingAddressSchema = new Schema({
//   city: {
//     type: String,
//     required: [true, "City is required"],
//   },
//   village: {
//     type: String,
//     required: [true, "Village is required"],
//   },
//   zip: {
//     type: String,
//     required: [true, "Zip is required"],
//   },
//   phoneNumber: {
//     type: String,
//     required: [true, "Phone number is required"],
//   },
// });

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    items: {
      type: [orderItemSchema],
      required: [true, "At least one item is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "canceled"],
      default: "pending",
    },

    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Shipping address is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card"],
      default: "cod",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrder>("Order", orderSchema);
