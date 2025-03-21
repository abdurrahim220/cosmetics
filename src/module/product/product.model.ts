import { model, Schema } from "mongoose";
import { IProduct, IRating } from "./product.interface";

const ratingSchema = new Schema<IRating>({
  star: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: [true, "Rating star is required"],
  },
  name: {
    type: String,
    required: [true, "Reviewer name is required"],
  },
  comment: {
    type: String,
    required: [true, "Comment is required"],
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "PostedBy is required"],
  },
});

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
        type: ratingSchema,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>("Product", productSchema);
