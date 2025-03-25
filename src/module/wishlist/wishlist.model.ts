import { model, Schema } from "mongoose";
import { IWishlist, IWishlistItem } from "./wishlist.interface";

const wishlistItemSchema = new Schema<IWishlistItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
});

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },
    items: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);
