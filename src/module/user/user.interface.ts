import { Types } from "mongoose";
import { UserRole, UserStatus } from "../../interface/sharedInterface";

export type IUser = {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  address?: Types.ObjectId;
  isDeleted: boolean;
};
