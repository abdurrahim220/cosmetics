import { model, Schema } from "mongoose";
import { IProduct, } from "./product.interface";




const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
    },
    whatsInBox: {
      type: String,
      required: false,
    },
    img: {
      type: [String],
      required: [true, "At least one image is required"],
    },
    video: {
      type: String,
      required: false,
    },
    wholesalePrice: {
      type: Number,
      required: [true, "Wholesale price is required"],
      min: [0, "Wholesale price cannot be negative"],
    },
    wholesaleMinimumQuantity: {
      type: Number,
      required: [true, "Wholesale minimum quantity is required"],
      min: [1, "Minimum quantity must be at least 1"],
    },
    categories: {
      type: [String],
      required: [true, "At least one category is required"],
    },
    concern: {
      type: [String],
      required: [true, "At least one concern is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    skinType: {
      type: [String],
      required: [true, "At least one skin type is required"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Original price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      required: false,
      min: [0, "Discount price cannot be negative"],
    },
    inStock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
    },
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rating",
        default: [],
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



export const Product = model<IProduct>("Product", productSchema);
