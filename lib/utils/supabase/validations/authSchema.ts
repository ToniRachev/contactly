import { MESSAGES } from '@/lib/constants/messages';
import { VALIDATION } from '@/lib/constants/validation';
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({
        message: MESSAGES.validation.login.invalidEmail,
    }),
    password: z.string()
        .min(VALIDATION.password.minLength, MESSAGES.validation.password.minLength)
        .max(VALIDATION.password.maxLength, MESSAGES.validation.password.maxLength)
})

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type LoginSchemaErrorType = z.inferFlattenedErrors<typeof loginSchema>;