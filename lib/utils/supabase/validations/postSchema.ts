import { MESSAGES } from '@/lib/constants/messages';
import { VALIDATION } from '@/lib/constants/validation';
import { z } from 'zod';

export const postSchema = z.object({
    body: z.string()
        .min(VALIDATION.post.minLength, MESSAGES.validation.post.minLength)
        .max(VALIDATION.post.maxLength, MESSAGES.validation.post.maxLength)
})

export const commentSchema = z.object({
    body: z.string()
        .min(VALIDATION.comment.minLength, MESSAGES.validation.comment.minLength)
        .max(VALIDATION.comment.maxLength, MESSAGES.validation.comment.maxLength)
})

export type PostSchemaType = z.infer<typeof postSchema>;
export type PostSchemaErrorType = z.inferFlattenedErrors<typeof postSchema>;
export type CommentSchemaType = z.infer<typeof commentSchema>;
export type CommentSchemaErrorType = z.inferFlattenedErrors<typeof commentSchema>;