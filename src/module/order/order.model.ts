// order.model.ts
import { model, Schema } from "mongoose";
import { IOrder, IOrderItem } from "./order.interface";

// Define the OrderItem schema (embedded document)
const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product", // Reference to Product model
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

// Define the Order schema
const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      unique: true, // Ensure uniqueness
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: [true, "User is required"],
    },
    items: {
      type: [orderItemSchema], // Array of embedded OrderItem documents
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
      default: "pending", // Default status
    },
    orderDate: {
      type: Date,
      required: [true, "Order date is required"],
      default: Date.now, // Default to current date/time
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address", // Reference to Address model
      required: [true, "Shipping address is required"],
    },
    paymentMethod: {
      type: String,
      required: false, // Optional field
    },
    isPaid: {
      type: Boolean,
      default: false, // Default to unpaid
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the Order model
export const Order = model<IOrder>("Order", orderSchema);