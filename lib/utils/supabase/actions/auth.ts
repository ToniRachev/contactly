'use server';

import { redirect } from "next/navigation";
import { createClient } from "../server";
import { revalidatePath } from "next/cache";
import { loginSchema, LoginSchemaErrorType, LoginSchemaType } from "../validations/authSchema";
import { isAuthApiError } from "@supabase/supabase-js";
import { createFormResult } from "../validations/utils";
import { MESSAGES } from "@/lib/constants/messages";

type LoginStateType = {
    data: LoginSchemaType,
    errors: LoginSchemaErrorType
}

export const parseAndValidateInput = (formData: FormData) => {
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const result = loginSchema.safeParse(data);

    return { data, result }
}

export const signInUser = async (data: LoginSchemaType) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        throw error;
    }
}

const postLoginSuccess = () => {
    revalidatePath('/', 'layout');
    redirect('/');
}

export async function login(state: LoginStateType, formData: FormData) {
    const { data, result } = parseAndValidateInput(formData);

    if (!result.success) {
        return createFormResult(data as LoginSchemaType, result.error.formErrors as LoginSchemaErrorType)
    }

    try {
        await signInUser(result.data);
    } catch (error) {
        if (isAuthApiError(error)) {
            return createFormResult(data as LoginSchemaType, MESSAGES.authError.login.invalidCredentials)
        }

        return createFormResult(data as LoginSchemaType, MESSAGES.genericError)
    }

    postLoginSuccess();
}

export async function signout() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    revalidatePath('/', 'layout');
    redirect('/login');
}