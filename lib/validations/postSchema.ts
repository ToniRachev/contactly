import { MESSAGES } from '@/lib/constants/messages';
import { VALIDATION } from '@/lib/constants/validation';
import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 5;

export const postSchema = z.object({
    body: z.string()
        .min(VALIDATION.post.minLength, MESSAGES.validation.post.minLength)
        .max(VALIDATION.post.maxLength, MESSAGES.validation.post.maxLength),
    images: z.array(
        z.instanceof(File)
            .refine(file => file.size <= MAX_FILE_SIZE, MESSAGES.validation.post.maxFileSize)
            .refine(file => file.type.startsWith('image/'), MESSAGES.validation.post.invalidFileType)
    ).optional()
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