import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").trim().email("invalid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .trim()
    .min(8, "Min 8 character strong password")
    .max(20, "Max 20 character strong password"),
});
