'use server';

import { redirect } from "next/navigation";
import { createClient } from "../../server";
import { revalidatePath } from "next/cache";
import { LoginSchemaErrorType, LoginSchemaType, SignupSchemaErrorType, SignupSchemaType } from "../../validations/authSchema";
import { isAuthApiError } from "@supabase/supabase-js";
import { createFormResult } from "../../validations/utils";
import { MESSAGES } from "@/lib/constants/messages";
import { parseAndValidateSigninInput, parseAndValidateSignupInput, postLoginSuccess, signInUser, signupUser } from "./helpers";

type LoginStateType = {
    data: LoginSchemaType,
    errors: LoginSchemaErrorType
}

export async function login(state: LoginStateType, formData: FormData) {
    const { data, result } = parseAndValidateSigninInput(formData);

    if (!result.success) {
        return createFormResult(data as LoginSchemaType, result.error.formErrors as LoginSchemaErrorType)
    }

    try {
        await signInUser(result.data);
    } catch (error) {
        if (isAuthApiError(error)) {
            return createFormResult({
                email: result.data.email,
                password: '',
            }, MESSAGES.authError.login.invalidCredentials)
        }

        return createFormResult(data as LoginSchemaType, MESSAGES.genericError)
    }

    return postLoginSuccess();
}

type SignupActionType = {
    data: SignupSchemaType,
    errors: SignupSchemaErrorType
}

export async function signup(state: SignupActionType, formData: FormData) {
    const { result, data } = parseAndValidateSignupInput(formData);

    if (!result.success) {
        return createFormResult(data as SignupSchemaType, result.error.formErrors as SignupSchemaErrorType)
    }

    try {
        await signupUser(result.data);
    } catch (error) {
        if (isAuthApiError(error)) {
            return createFormResult(result.data, error.message)
        }

        return createFormResult(result.data, MESSAGES.genericError)
    }

    return postLoginSuccess();
}

export async function signout() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    revalidatePath('/', 'layout');
    redirect('/login');
}