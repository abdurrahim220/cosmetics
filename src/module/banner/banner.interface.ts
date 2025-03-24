import { Types } from "mongoose";

export type IBanner = {
  title: string;
  subTitle: string;
  img: string;
  user: Types.ObjectId;
};
