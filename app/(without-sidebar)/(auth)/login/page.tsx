'use client';

import { login } from "@/lib/actions/auth/auth.actions";
import { LoginSchemaErrorType, LoginSchemaType } from "@/lib/validations/authSchema";
import { useActionState } from "react";
import FormWrapper from "../components/form-wrapper";
import ErrorMessage from "@/components/error-message";
import FormInput from "@/components/input-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, {
        data: {
            email: '',
            password: '',
        } as LoginSchemaType,
        errors: {} as LoginSchemaErrorType
    });

    return (
        <FormWrapper>
            <form className="flex flex-col gap-4 min-w-[30vw]">
                <FormInput
                    label="Email"
                    name="email"
                    defaultValue={state.data.email}
                    type="email"
                    placeholder="johndoe@gmail.com"
                    error={state.errors?.fieldErrors?.email?.[0]}
                />

                <FormInput
                    label="Password"
                    name="password"
                    defaultValue={state.data.password}
                    type="password"
                    placeholder="******"
                    error={state.errors?.fieldErrors?.password?.[0]}
                />

                <Button formAction={formAction} variant={'secondary'} disabled={isPending}>Signin</Button>

                {state.errors?.formErrors?.length > 0 && (
                    <ErrorMessage>
                        {state.errors?.formErrors[0]}
                    </ErrorMessage>
                )}
            </form>

            <div className="pt-4">
                <p>
                    New here?
                    <span className="pl-1 font-bold">
                        <Link href={'/register'}>
                            Create your profile
                        </Link>
                    </span>
                </p>
            </div>
        </FormWrapper>
    )
}