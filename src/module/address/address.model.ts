import { model, Schema } from "mongoose";
import { IAddress } from "./address.interface";

const addressSchema = new Schema<IAddress>({
  city: {
    type: String,
    required: [true, "City is required"],
  },
  post: {
    type: Number,
    required: [true, "Post is required"],
  },
  village: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
  },
  zip: {
    type: String,
    required: [true, "Zip is required"],
    minlength:4,
    maxlength:10
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
},{
  timestamps:true
});

export const Address = model<IAddress>("Address", addressSchema);
