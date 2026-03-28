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

export const updateProfileSchema = z.object({
  name: z.string({ message: "Name must be a string" }).optional(),
  bio: z.string({ message: "Bio must be a string" }).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
