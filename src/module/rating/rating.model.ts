import { model, Schema } from "mongoose";
import { IRating } from "./rating.interface";

const ratingSchema = new Schema<IRating>({
  star: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: [true, "Rating star is required"],
  },
  name: {
    type: String,
    required: [true, "Reviewer name is required"],
  },
  comment: {
    type: String,
    required: [true, "Comment is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "PostedBy is required"],
  },
});

export const Rating = model<IRating>("Rating", ratingSchema);
