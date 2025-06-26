'use client';

import { login } from "@/lib/utils/supabase/actions/auth/auth";
import { LoginSchemaErrorType, LoginSchemaType } from "@/lib/utils/supabase/validations/authSchema";
import { useActionState } from "react";
import FormWrapper from "../components/form-wrapper";
import Input from "@/components/input";
import ErrorMessage from "@/components/error-message";

export default function LoginPage() {
    const [state, formAction] = useActionState(login, {
        data: {
            email: '',
            password: '',
        } as LoginSchemaType,
        errors: {} as LoginSchemaErrorType
    });

    return (
        <FormWrapper>
            <form className="flex flex-col gap-4 min-w-[30vw]">
                <Input
                    name="email"
                    value={state.data.email}
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    error={state.errors?.fieldErrors?.email?.[0]}
                />

                <Input
                    name="password"
                    value={state.data.password}
                    label="Password"
                    placeholder="*******"
                    error={state.errors?.fieldErrors?.password?.[0]}
                />

                <button formAction={formAction} className="bg-black text-stone-200 px-12 py-2">Login</button>
                {state.errors?.formErrors?.length > 0 && (
                    <ErrorMessage>
                        {state.errors?.formErrors[0]}
                    </ErrorMessage>
                )}
            </form>
        </FormWrapper>
    )
}