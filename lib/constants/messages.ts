import { VALIDATION } from "./validation";

export const MESSAGES = {
    authError: {
        login: {
            invalidCredentials: 'Invalid email or password'
        }
    },
    validation: {
        invalidEmail: 'Invalid email address',
        password: {
            minLength: `Password must be at least ${VALIDATION.password.minLength} characters long`,
            maxLength: `Password must not exceed ${VALIDATION.password.maxLength} characters`
        },
        signup: {
            firstName: {
                minLength: `First name must be at least ${VALIDATION.signup.firstName.minLength} characters`,
                maxLength: `First name must be ${VALIDATION.signup.firstName.maxLength} characters or fewer`
            },
            lastName: {
                minLength: `Last name must be at least ${VALIDATION.signup.lastName.minLength} characters`,
                maxLength: `Last name must be ${VALIDATION.signup.lastName.maxLength} characters or fewer`
            },
            passwordsDontMatch: 'Passwords doesn\'t match'
        },
        post: {
            minLength: 'Post is too short to share.',
            maxLength: 'Post is too long. Please keep it under 500 characters',
            maxFileSize: 'File size is too large. Please keep it under 5MB',
            invalidFileType: 'Invalid file type. Please upload an image'
        },
        comment: {
            minLength: 'Comment is too short to share.',
            maxLength: 'Comment is too long. Please keep it under 500 characters'
        },
        user: {
            bio: {
                hometown: {
                    minLength: `Hometown must be at least ${VALIDATION.user.bio.hometown.minLength} characters`,
                    maxLength: `Hometown must be ${VALIDATION.user.bio.hometown.maxLength} characters or fewer`
                },
                currentCity: {
                    minLength: `Current city must be at least ${VALIDATION.user.bio.currentCity.minLength} characters`,
                    maxLength: `Current city must be ${VALIDATION.user.bio.currentCity.maxLength} characters or fewer`
                },
                highSchool: {
                    minLength: `High school must be at least ${VALIDATION.user.bio.highSchool.minLength} characters`,
                    maxLength: `High school must be ${VALIDATION.user.bio.highSchool.maxLength} characters or fewer`
                }
            }
        }
    },

    genericError: 'Something went wrong. Please try again.'
}