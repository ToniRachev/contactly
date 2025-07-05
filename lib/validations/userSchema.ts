import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES =
    [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ];

export const updateUserImageSchema = z.object({
    image: z.instanceof(File).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Only JPEG, JPG, PNG and WebP images are allowed'
    }).refine((file) => file.size <= MAX_FILE_SIZE, {
        message: 'File size must be less than 5MB'
    })
})

export type UpdateUserImageSchema = z.infer<typeof updateUserImageSchema>;
export type UpdateUserImageSchemaErrorType = z.inferFlattenedErrors<typeof updateUserImageSchema>;