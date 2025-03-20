// order.interface.ts
import { Types } from "mongoose";

export type IOrderItem = {
  product: Types.ObjectId;
  quantity: number;
  price: number;
};

export type IOrder = {
  orderId: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: "pending" | "shipped" | "delivered" | "canceled";
  orderDate: Date;
  shippingAddress: Types.ObjectId;
  paymentMethod?: string;
  isPaid: boolean;
};
