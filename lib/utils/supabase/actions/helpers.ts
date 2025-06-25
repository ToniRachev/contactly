import { revalidatePath } from "next/cache";
import { createClient } from "../server";
import { loginSchema, LoginSchemaType } from "../validations/authSchema";
import { redirect } from "next/navigation";

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

export const postLoginSuccess = () => {
    revalidatePath('/', 'layout');
    redirect('/');
}