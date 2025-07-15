'use server';

import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { loginSchema, LoginSchemaErrorType, LoginSchemaType, signupSchema, SignupSchemaErrorType, SignupSchemaType } from "@/lib/validations/authSchema";
import { isAuthApiError } from "@supabase/supabase-js";
import { createFormResult } from "@/lib/validations/utils";
import { MESSAGES } from "@/lib/constants/messages";
import { parseAndValidateFormData } from "@/lib/utils";
import { updateUserPresenceStatus } from "../user/user.actions";
import { USER_PRESENCE_STATUS } from "@/lib/constants/user";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type LoginStateType = {
    data: LoginSchemaType,
    errors: LoginSchemaErrorType,
    success: boolean
}

const postLoginSuccess = () => {
    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signInUser(data: LoginSchemaType) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        throw error;
    }
}


export async function login(state: LoginStateType, formData: FormData) {
    const { data, result } = parseAndValidateFormData(formData, loginSchema, [
        'email',
        'password'
    ])

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

export async function signupUser(data: SignupSchemaType) {
    const supabase = await createClient();

    const { email, password, firstName, lastName } = data;

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email, password
    })

    if (authError) {
        throw authError;
    }

    const { data: userData, error: userError } = await supabase.from('users')
        .insert([{
            id: authData.user?.id,
            first_name: firstName,
            last_name: lastName,
            email: authData.user?.email
        }])
        .select();


    if (userError) {
        throw userError;
    }

    return userData;
}

export async function signup(state: SignupActionType, formData: FormData) {
    const { result, data } = parseAndValidateFormData(formData, signupSchema, [
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmPassword'
    ])

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

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await updateUserPresenceStatus(user.id, USER_PRESENCE_STATUS.OFFLINE);
        }

        supabase.auth.signOut();

        revalidatePath('/', 'layout');
        redirect('/login');
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        console.error('Failed to sign out', error);
    }
}