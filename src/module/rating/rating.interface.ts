import { Types } from "mongoose";

export type IRating = {
  star: 1 | 2 | 3 | 4 | 5;
  name: string;
  comment: string;
  user: Types.ObjectId;
};
