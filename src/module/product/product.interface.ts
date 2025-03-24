import { Types } from "mongoose";

export type IProduct = {
  _id?: Types.ObjectId;
  title: string;
  user: Types.ObjectId;
  desc: string;
  whatsInBox: string;
  img: string[];
  video: string;
  wholesalePrice: number;
  wholesaleMinimumQuantity: number;
  categories: string[];
  concern: string[];
  brand: string;
  skinType: string[];
  originalPrice: number;
  discountPrice: number;
  averageRating?: number;
  totalRating?: number;
  totalReview?: number;
  inStock: number;
  ratings: Types.ObjectId[];  
  isVerified: boolean;
};
