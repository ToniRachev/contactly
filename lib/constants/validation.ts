export const VALIDATION = {
    password: {
        minLength: 6,
        maxLength: 72,
    },
    signup: {
        firstName: {
            minLength: 2,
            maxLength: 30,
        },
        lastName: {
            minLength: 2,
            maxLength: 30
        },
    },
    post: {
        minLength: 1,
        maxLength: 500
    }
}