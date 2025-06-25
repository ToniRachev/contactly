'use server';

import { redirect } from "next/navigation";
import { createClient } from "../server";
import { revalidatePath } from "next/cache";
import { LoginSchemaErrorType, LoginSchemaType } from "../validations/authSchema";
import { isAuthApiError } from "@supabase/supabase-js";
import { createFormResult } from "../validations/utils";
import { MESSAGES } from "@/lib/constants/messages";
import { parseAndValidateInput, postLoginSuccess, signInUser } from "./helpers";

type LoginStateType = {
    data: LoginSchemaType,
    errors: LoginSchemaErrorType
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

    return postLoginSuccess();
}

export async function signout() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    revalidatePath('/', 'layout');
    redirect('/login');
}