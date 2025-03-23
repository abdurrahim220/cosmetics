import { Types } from "mongoose";

export type IAddress = {
  city: string;
  post: number;
  village?: string;
  phoneNumber: string;
  zip: string;
  user: Types.ObjectId;
};
