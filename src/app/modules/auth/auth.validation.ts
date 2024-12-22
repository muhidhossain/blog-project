import { z } from 'zod';

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().trim().email(),
    password: z.string().min(6).max(255),
    role: z.enum(['admin', 'user']).optional(),
    isBlocked: z.boolean().optional(),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(6).max(255),
  }),
});

export const AuthValidation = {
  loginUserValidationSchema,
  registerUserValidationSchema,
};
