import { Types } from "mongoose";

export type IRating = {
  star: 1 | 2 | 3 | 4 | 5;
  name: string;
  comment: string;
  postedBy: Types.ObjectId;
};

export type IProduct = {
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
  inStock: number;
  ratings: IRating;
};
