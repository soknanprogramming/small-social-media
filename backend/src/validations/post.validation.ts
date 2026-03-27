import { title } from 'node:process';
import { z } from 'zod';

// Not working for form-data, need to preprocess the published field to convert string "true"/"false" to boolean
// export const postSchema = z.object({
//   title: z.string({ message: "Title must be a string" }).min(1, { message: "Title is required" }),
//   content: z.string({ message: "Content must be a string" }).min(1, { message: "Content is required" }).optional(),
//   published: z.boolean({ message: "Published must be a boolean" }),
// });

export const postSchema = z.object({
  title: z.string({ message: "Title must be a string" }).min(1, { message: "Title is required" }),
  content: z.string({ message: "Content must be a string" }).min(1, { message: "Content is required" }).optional(),
  published: z.preprocess(
    (val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") return val === "true";
      return false;
    },
    z.boolean({ message: "Published must be a boolean" })
  ),
});