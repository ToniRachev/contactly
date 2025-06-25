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

export async function login(state: LoginStateType, formData: FormData) {
    const data = Object.fromEntries(formData);
    const result = loginSchema.safeParse(data);

    if (!result.success) {
        return createFormResult(data as LoginSchemaType, result.error.formErrors as LoginSchemaErrorType)
    }

    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.signInWithPassword(result.data);

        if (error) {
            if (isAuthApiError(error)) {
                return createFormResult(data as LoginSchemaType, MESSAGES.authError.login.invalidCredentials)
            }
            throw error;
        }

    } catch (_) {
        return createFormResult(data as LoginSchemaType, MESSAGES.genericError)
    }

    revalidatePath('/', 'layout');

    redirect('/');
}

export async function signout() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    revalidatePath('/', 'layout');
    redirect('/login');
}