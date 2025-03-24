import { model, Schema } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    subTitle: {
      type: String,
      required: [true, "subTitle is required"],
    },
    img: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  {
    timestamps: true,
  }
);

export const Banner = model<IBanner>("Banner", bannerSchema);
