'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { UserDBType } from "@/lib/types/user";
import { transformUserData } from "@/lib/utils/transform";
import { updateUserImageSchema, UpdateUserImageSchemaErrorType } from "@/lib/validations/userSchema";
import { createFormResult } from "@/lib/validations/utils";
import { MESSAGES } from "@/lib/constants/messages";

export async function fetchUserProfile(userId: string) {
    const supabase = await createClient();

    const query = supabase.from('users')
        .select(`*, biography(*)`)
        .eq('id', userId)
        .single();

    const data = await baseFetcher<UserDBType>(query);

    return transformUserData(data);
}

export async function getUserId() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw new Error('User ID not found but user should be authenticated')
    }

    return data.user.id;
}

export async function updateUserImage(userId: string, image: File, imageType: 'avatar' | 'cover') {
    const supabase = await createClient();
    const uuid = crypto.randomUUID();

    const { data: imageData, error } = await supabase.storage.from(imageType).upload(uuid, image, { upsert: true });

    if (error) {
        console.error('Failed to update user image', error);
        throw new Error('Failed to update user image')
    }

    if (!imageData.path) {
        throw new Error('Failed to update user image')
    }

    const imageUrl = process.env.IMAGE_PATH + imageType + '/' + imageData.path;

    await baseFetcher(
        supabase.from('users')
            .update({ [imageType + '_url']: imageUrl })
            .eq('id', userId)
    )

    return imageUrl;
}

type UpdateUserImageActionState = {
    success: boolean;
    errors: UpdateUserImageSchemaErrorType;
    imageUrl: string | null;
}

export async function updateUserImageAction(userId: string, imageType: 'avatar' | 'cover', state: UpdateUserImageActionState, formData: FormData) {
    const data = {
        image: formData.get('image')
    }

    const result = updateUserImageSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.formErrors as UpdateUserImageSchemaErrorType,
            imageUrl: null
        }
    }

    try {
        const imageUrl = await updateUserImage(userId, result.data.image, imageType);

        return {
            success: true,
            errors: {} as UpdateUserImageSchemaErrorType,
            imageUrl
        }
    } catch (error) {
        console.error('Failed to update user image', error);

        const formResult = createFormResult(data, MESSAGES.genericError)

        return {
            success: false,
            errors: formResult.errors,
            imageUrl: null
        }
    }
}