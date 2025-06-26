'use client';

import { signup } from "@/lib/utils/supabase/actions/auth/auth";
import { SignupSchemaErrorType, SignupSchemaType } from "@/lib/utils/supabase/validations/authSchema";
import { useActionState } from "react";

const initialState = {
    data: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    } as SignupSchemaType,
    errors: {} as SignupSchemaErrorType
}

export default function Signup() {
    const [state, formAction] = useActionState(signup, initialState);

    return (
        <form className="flex flex-col gap-4 justify-center items-center">
            <label htmlFor="firstName">First Name</label>
            <input name="firstName" className="border" defaultValue={state.data.firstName} />
            <p>{state.errors?.fieldErrors?.firstName}</p>

            <label htmlFor="lastName">Last Name</label>
            <input name="lastName" className="border" defaultValue={state.data.lastName} />
            <p>{state.errors?.fieldErrors?.lastName}</p>

            <label htmlFor="email">Email</label>
            <input name="email" className="border" defaultValue={state.data.email} />
            <p>{state.errors?.fieldErrors?.email}</p>

            <label htmlFor="email">Password</label>
            <input name="password" className="border" />
            <p>{state.errors?.fieldErrors?.password}</p>

            <label htmlFor="confirmPassword">Confirm password</label>
            <input name="confirmPassword" className="border" />
            <p>{state.errors?.fieldErrors?.confirmPassword}</p>

            <button formAction={formAction} className="bg-black text-stone-200 px-12 py-2">Login</button>
            {state.errors?.formErrors?.length > 0 && (
                <p>{state.errors.formErrors[0]}</p>
            )}
        </form>
    )
}