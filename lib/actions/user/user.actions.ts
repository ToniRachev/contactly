'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { UserDBType } from "@/lib/types/user";
import { transformUserData } from "@/lib/utils/transform";
import { updateUserAvatarSchema, UpdateUserAvatarSchemaErrorType } from "@/lib/validations/userSchema";
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

export async function updateUserAvatar(userId: string, avatar: File) {
    const supabase = await createClient();
    const uuid = crypto.randomUUID();

    const { data: avatarData, error } = await supabase.storage.from('avatars').upload(uuid, avatar, { upsert: true });

    if (error) {
        console.error('Failed to update user avatar', error);
        throw new Error('Failed to update user avatar')
    }

    if (!avatarData.path) {
        throw new Error('Failed to update user avatar')
    }

    const avatarUrl = process.env.IMAGE_PATH + avatarData.path;

    await baseFetcher(
        supabase.from('users')
            .update({ avatar_url: avatarUrl })
            .eq('id', userId)
    )

    return avatarUrl;
}

type UpdateUserAvatarActionState = {
    success: boolean;
    errors: UpdateUserAvatarSchemaErrorType;
    avatarUrl: string | null;
}

export async function updateUserAvatarAction(userId: string, state: UpdateUserAvatarActionState, formData: FormData) {
    const data = {
        avatar: formData.get('avatar')
    }

    const result = updateUserAvatarSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.formErrors as UpdateUserAvatarSchemaErrorType,
            avatarUrl: null
        }
    }

    try {
        const avatarUrl = await updateUserAvatar(userId, result.data.avatar);

        return {
            success: true,
            errors: {} as UpdateUserAvatarSchemaErrorType,
            avatarUrl
        }
    } catch (error) {
        console.error('Failed to update user avatar', error);

        const formResult = createFormResult(data, MESSAGES.genericError)

        return {
            success: false,
            errors: formResult.errors,
            avatarUrl: null
        }
    }
}