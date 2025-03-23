import { z } from "zod";

const addressZodValidationSchema = z.object({
  body: z.object({
    city: z.string({
      required_error: "City is required",
    }),
    post: z.string({
      required_error: "Post is required",
    }),
    village: z.string().optional(),
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    zip: z
      .string({
        required_error: "Zip is required",
      })
      .min(4, {
        message: "Zip must be at least 4 characters long",
      })
      .max(10, {
        message: "Zip must be at most 10 characters long",
      }),
    user: z.string({
      required_error: "User is required",
    }),
  }),
});

export const addressZodValidation = {
  addressZodValidationSchema,
};
