import { z } from "zod";

export const createPostSchema = z.object({
  caption: z
    .string()
    .min(6, { message: "Caption must be at least 6 characters long" }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
