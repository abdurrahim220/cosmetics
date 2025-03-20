import { Types } from "mongoose";

export type IAddress = {
  city: string;
  post: number;
  village?: string;
  phoneNumber: number;
  zip: number;
  user: Types.ObjectId;
};
