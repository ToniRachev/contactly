'use client';

import { signup } from "@/lib/utils/supabase/actions/auth/auth.actions";
import { SignupSchemaErrorType, SignupSchemaType } from "@/lib/validations/authSchema";
import { useActionState } from "react";
import FormWrapper from "../components/form-wrapper";
import FormInput from "@/components/input-wrapper";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/error-message";
import Link from "next/link";

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
    const [state, formAction, isPending] = useActionState(signup, initialState);

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

                <div className="flex w-full gap-4">
                    <div className="flex-1">
                        <FormInput
                            label="First name"
                            name="firstName"
                            defaultValue={state.data.firstName}
                            placeholder="John"
                            error={state.errors?.fieldErrors?.firstName?.[0]}
                        />
                    </div>

                    <div className="flex-1">
                        <FormInput
                            label="Last name"
                            name="lastName"
                            defaultValue={state.data.lastName}
                            placeholder="Doe"
                            error={state.errors?.fieldErrors?.lastName?.[0]}
                        />
                    </div>
                </div>

                <FormInput
                    label="Password"
                    name="password"
                    defaultValue={state.data.password}
                    type="password"
                    placeholder="******"
                    error={state.errors?.fieldErrors?.password?.[0]}
                />

                <FormInput
                    label="Confirm password"
                    name="confirmPassword"
                    defaultValue={state.data.confirmPassword}
                    type="password"
                    placeholder="******"
                    error={state.errors?.fieldErrors?.confirmPassword?.[0]}
                />

                <Button formAction={formAction} variant={'secondary'} disabled={isPending}>Sign up</Button>

                {state.errors?.formErrors?.length > 0 && (
                    <ErrorMessage>
                        {state.errors?.formErrors[0]}
                    </ErrorMessage>
                )}
            </form>

            <div className="pt-4">
                <p>
                    Already have an account?
                    <span className="pl-1 font-bold">
                        <Link href={'/login'}>
                            Sign in here
                        </Link>
                    </span>
                </p>
            </div>
        </FormWrapper>
    )
}