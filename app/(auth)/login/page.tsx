'use client';

import { login } from "@/lib/utils/supabase/actions/auth";
import { LoginSchemaErrorType } from "@/lib/utils/supabase/validations/authSchema";
import { useActionState } from "react";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, {
        data: {
            email: '',
            password: '',
        },
        errors: {} as LoginSchemaErrorType
    });

    return (
        <form className="flex flex-col gap-4 justify-center items-center">
            <label htmlFor="email">Email</label>
            <input defaultValue={state.data.email} name="email" className="border" />
            <p>{state.errors?.fieldErrors?.email}</p>

            <label htmlFor="email">Password</label>
            <input id="email" name="password" className="border" />
            <p>{state.errors?.fieldErrors?.password}</p>

            <button formAction={formAction} className="bg-black text-stone-200 px-12 py-2">Login</button>
            {state.errors?.formErrors?.length > 0 && (
                <p>{state.errors.formErrors[0]}</p>
            )}
        </form>
    )
}