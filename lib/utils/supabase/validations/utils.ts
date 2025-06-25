import { ZodError, } from "zod"

export const createFormError = (message: string) => {
    const zodError = new ZodError([
        {
            code: 'custom',
            message,
            path: [],
        }
    ])
    return zodError.formErrors
}


export const createFormResult = <T extends Record<string, any>>(
    data: T,
    errorData: ZodError<T>['formErrors'] | string
) => ({
    data,
    errors: typeof errorData === 'string' ? createFormError(errorData) : errorData
})