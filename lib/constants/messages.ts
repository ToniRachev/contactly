import { VALIDATION } from "./validation";

export const MESSAGES = {
    authError: {
        login: {
            invalidCredentials: 'Invalid email or password'
        }
    },
    validation: {
        password: {
            minLength: `Password must be at least ${VALIDATION.password.minLength} characters long`,
            maxLength: `Password must not exceed ${VALIDATION.password.maxLength} characters`
        },
        login: {
            invalidEmail: 'Invalid email address'
        }
    },
    genericError: 'Something went wrong. Please try again.'
}