import { MESSAGES } from '@/lib/constants/messages';
import { VALIDATION } from '@/lib/constants/validation';
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({
        message: MESSAGES.validation.invalidEmail,
    }),
    password: z.string()
        .min(VALIDATION.password.minLength, MESSAGES.validation.password.minLength)
        .max(VALIDATION.password.maxLength, MESSAGES.validation.password.maxLength)
})

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type LoginSchemaErrorType = z.inferFlattenedErrors<typeof loginSchema>;

export const signupSchema = z.object({
    firstName: z.string()
        .min(VALIDATION.signup.firstName.minLength, MESSAGES.validation.signup.firstName.minLength)
        .max(VALIDATION.signup.firstName.maxLength, MESSAGES.validation.signup.firstName.maxLength),
    lastName: z.string()
        .min(VALIDATION.signup.lastName.minLength, MESSAGES.validation.signup.lastName.minLength)
        .max(VALIDATION.signup.lastName.maxLength, MESSAGES.validation.signup.lastName.maxLength),
    email: z.string().email(MESSAGES.validation.invalidEmail),
    password: z.string()
        .min(VALIDATION.password.minLength, MESSAGES.validation.password.minLength)
        .max(VALIDATION.password.maxLength, MESSAGES.validation.password.maxLength),
    confirmPassword: z.string()
        .min(VALIDATION.password.minLength, MESSAGES.validation.password.minLength)
        .max(VALIDATION.password.maxLength, MESSAGES.validation.password.maxLength)
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords doesn\'t match',
    path: ['confirmPassword'],
})

export type SignupSchemaType = z.infer<typeof signupSchema>;
export type SignupSchemaErrorType = z.inferFlattenedErrors<typeof signupSchema>;