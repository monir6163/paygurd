import { z } from "zod";

export const paymentRequestSchema = z.object({
  title: z
    .string()
    .nonempty({ message: "Title is required" })
    .min(10, { message: "Title must be at least 10 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  amount: z
    .string()
    .nonempty({ message: "Amount is required" })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Amount must be a positive number",
    }),
});
