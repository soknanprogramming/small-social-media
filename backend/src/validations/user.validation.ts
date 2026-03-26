import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string({ message: "Invalid email address" }).email({ message: "Invalid email address" }),
  password: z.string({ message: "Password must be at least 6 characters long" }).min(6, { message: "Password must be at least 6 characters long" }),
  name: z.string({ message: "Name must be a string" }).optional(),
});

export const loginSchema = z.object({
  email: z.string({ message: "Invalid email address" }).email({ message: "Invalid email address" }),
  password: z.string({ message: "Password is required" }).min(1, { message: "Password is required" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
