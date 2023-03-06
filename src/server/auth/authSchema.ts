import * as z from "zod";

export const loginSchema = z.object({
  //username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const signUpSchema = loginSchema.extend({
  username: z.string().min(3).max(20),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
