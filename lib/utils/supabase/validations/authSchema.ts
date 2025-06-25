import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({
        message: 'Invalid email address'
    }),
    password: z.string().min(6, 'Password must be at least 6 characters').max(20, 'Password must not exceed 20 characters')
})

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type LoginSchemaErrorType = z.inferFlattenedErrors<typeof loginSchema>;