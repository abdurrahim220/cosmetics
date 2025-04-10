// order.interface.ts
import { Types } from "mongoose";

export type IOrderItem = {
  products: Types.ObjectId;
  quantity: number;
  price: number;
};


export type IOrder = {
  _id?: Types.ObjectId;
  orderId: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: "pending" | "shipped" | "delivered" | "canceled";
  shippingAddress: Types.ObjectId;
  paymentMethod?: "cod" | "card";
  isPaid: boolean;
};
