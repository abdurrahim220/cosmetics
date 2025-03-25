import { Types } from "mongoose";

export interface IWishlistItem {
  product: Types.ObjectId;
}

export type IWishlist = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  items: IWishlistItem[];
  createdAt?: Date;
  updatedAt?: Date;
};
