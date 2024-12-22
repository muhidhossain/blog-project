import { z } from 'zod';

const createBlogPostValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(255),
    content: z.string().trim().min(10),
    author: z.string().uuid().optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const BlogValidation = {
  createBlogPostValidationSchema,
};
