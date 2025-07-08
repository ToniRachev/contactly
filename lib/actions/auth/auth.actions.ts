'use server';

import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { LoginSchemaErrorType, LoginSchemaType, SignupSchemaErrorType, SignupSchemaType } from "@/lib/validations/authSchema";
import { isAuthApiError } from "@supabase/supabase-js";
import { createFormResult } from "@/lib/validations/utils";
import { MESSAGES } from "@/lib/constants/messages";
import { parseAndValidateSigninInput, parseAndValidateSignupInput, postLoginSuccess, signInUser, signupUser } from "./auth.helpers";

type LoginStateType = {
    data: LoginSchemaType,
    errors: LoginSchemaErrorType,
    success: boolean
}

export async function login(state: LoginStateType, formData: FormData) {
    const { data, result } = parseAndValidateSigninInput(formData);

    if (!result.success) {
        return createFormResult(data as LoginSchemaType, result.error.formErrors as LoginSchemaErrorType, false)
    }

    try {
        await signInUser(result.data);
    } catch (error) {
        if (isAuthApiError(error)) {
            return createFormResult({
                email: result.data.email,
                password: '',
            }, MESSAGES.authError.login.invalidCredentials, false)
        }

        return createFormResult(data as LoginSchemaType, MESSAGES.genericError, false)
    }

    return postLoginSuccess();
}

type SignupActionType = {
    data: SignupSchemaType,
    errors: SignupSchemaErrorType,
    success: boolean
}

export async function signup(state: SignupActionType, formData: FormData) {
    const { result, data } = parseAndValidateSignupInput(formData);

    if (!result.success) {
        return createFormResult(data as SignupSchemaType, result.error.formErrors as SignupSchemaErrorType, false)
    }

    try {
        await signupUser(result.data);
    } catch (error) {
        if (isAuthApiError(error)) {
            return createFormResult(result.data, error.message, false)
        }

        return createFormResult(result.data, MESSAGES.genericError, false)
    }

    return postLoginSuccess();
}

export async function signout() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    revalidatePath('/', 'layout');
    redirect('/login');
}