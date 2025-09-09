import { z } from 'zod';

export const usernameSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(12, 'Max 12 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid characters')
    .regex(/^\S+$/, 'Must be a single word'),
});

export type UsernameFormData = z.infer<typeof usernameSchema>;
