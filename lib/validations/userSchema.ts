import { z } from "zod";
import { MESSAGES } from "../constants/messages";
import { VALIDATION } from "../constants/validation";

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

type MinMax = {
    value: number;
    message: string;
}

const createStringFieldSchema = (fieldName: string, min: MinMax, max: MinMax) => {
    return z.object({
        [fieldName]: z.string()
            .min(min.value, min.message)
            .max(max.value, max.message)
    })
}

export type UpdateUserImageSchemaType = z.infer<typeof updateUserImageSchema>;
export type UpdateUserImageSchemaErrorType = z.inferFlattenedErrors<typeof updateUserImageSchema>;

export const updateHometownSchema = createStringFieldSchema('hometown', {
    value: VALIDATION.user.bio.hometown.minLength,
    message: MESSAGES.validation.user.bio.hometown.minLength
}, {
    value: VALIDATION.user.bio.hometown.maxLength,
    message: MESSAGES.validation.user.bio.hometown.maxLength
})

export type UpdateHometownSchemaType = z.infer<typeof updateHometownSchema>;
export type UpdateHometownSchemaErrorType = z.inferFlattenedErrors<typeof updateHometownSchema>;

export const updateCurrentCitySchema = createStringFieldSchema('currentCity', {
    value: VALIDATION.user.bio.currentCity.minLength,
    message: MESSAGES.validation.user.bio.currentCity.minLength
}, {
    value: VALIDATION.user.bio.currentCity.maxLength,
    message: MESSAGES.validation.user.bio.currentCity.maxLength
})

export type UpdateCurrentCitySchemaType = z.infer<typeof updateCurrentCitySchema>;
export type UpdateCurrentCitySchemaErrorType = z.inferFlattenedErrors<typeof updateCurrentCitySchema>;

export const updateHighSchoolSchema = createStringFieldSchema('school', {
    value: VALIDATION.user.bio.highSchool.minLength,
    message: MESSAGES.validation.user.bio.highSchool.minLength
}, {
    value: VALIDATION.user.bio.highSchool.maxLength,
    message: MESSAGES.validation.user.bio.highSchool.maxLength
})

export type UpdateHighSchoolSchemaType = z.infer<typeof updateHighSchoolSchema>;
export type UpdateHighSchoolSchemaErrorType = z.inferFlattenedErrors<typeof updateHighSchoolSchema>;


export const updateBirthDateSchema = z.object({
    birthDate: z.preprocess((val) => {
        if (!val || typeof val !== "string") return undefined;

        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
    },
        z.date({
            required_error: "Birth date is required",
            invalid_type_error: "Invalid date format",
        })
            .refine((date) => date < new Date(), {
                message: 'Birth date must be in the past',
            })
            .refine((date) => date > new Date(1900, 0, 1), {
                message: 'Birth date must be after 1900',
            })
            .refine((date) => {
                const today = new Date();
                const age = today.getFullYear() - date.getFullYear();
                return age >= 16;
            }, {
                message: 'You must be at least 16 years old',
            }))
});

export type UpdateBirthDateSchemaType = z.infer<typeof updateBirthDateSchema>;
export type UpdateBirthDateSchemaErrorType = z.inferFlattenedErrors<typeof updateBirthDateSchema>;

export const updateBioSchemas = {
    hometown: updateHometownSchema,
    currentCity: updateCurrentCitySchema,
    school: updateHighSchoolSchema,
    birthDate: updateBirthDateSchema
}