import { revalidatePath } from "next/cache";
import { createClient } from "../server";
import { loginSchema, LoginSchemaType, signupSchema, SignupSchemaType } from "../validations/authSchema";
import { redirect } from "next/navigation";

export const parseAndValidateSigninInput = (formData: FormData) => {
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const result = loginSchema.safeParse(data);

    return { data, result }
}

export const parseAndValidateSignupInput = (formData: FormData) => {
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    }

    const result = signupSchema.safeParse(data);

    return { data, result };
}

export const signInUser = async (data: LoginSchemaType) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        throw error;
    }
}

export const signupUser = async (data: SignupSchemaType) => {
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
        }])
        .select();


    if (userError) {
        throw userError;
    }

    return userData;
}

export const postLoginSuccess = () => {
    revalidatePath('/', 'layout');
    redirect('/');
}