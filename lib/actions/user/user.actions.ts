'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { UserDBType } from "@/lib/types/user";
import { transformUserData } from "@/lib/utils/transform";
import {
    UpdateHometownSchemaType,
    UpdateHometownSchemaErrorType,
    updateUserImageSchema,
    UpdateUserImageSchemaErrorType,
    UpdateUserImageSchemaType,
    updateBioSchemas
} from "@/lib/validations/userSchema";
import { createFormResult } from "@/lib/validations/utils";
import { MESSAGES } from "@/lib/constants/messages";
import { ActionState } from "@/app/(without-friends-sidebar)/profile/components/edit-profile/edit-bio/types";
import { revalidateTag, unstable_cache } from "next/cache";

export async function fetchUserProfile(userId: string) {
    const supabase = await createClient();

    return unstable_cache(
        async (supabaseClient) => {
            const query = supabaseClient.from('users')
                .select(`*, biography(*)`)
                .eq('id', userId)
                .single();

            const data = await baseFetcher<UserDBType>(query);
            return transformUserData(data);
        },
        [`user-profile-${userId}`],
        {
            revalidate: 60 * 60 * 24
        }
    )(supabase);
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
    data: UpdateUserImageSchemaType;
    errors: UpdateUserImageSchemaErrorType | null;
    success: boolean;
    imageUrl: string | null;
}

export async function updateUserImageAction(userId: string, imageType: 'avatar' | 'cover', state: UpdateUserImageActionState, formData: FormData) {
    const data = {
        image: formData.get('image') as File
    }

    const result = updateUserImageSchema.safeParse(data);

    if (!result.success) {
        return {
            ...createFormResult(data, result.error.formErrors, false),
            imageUrl: null
        }
    }

    try {
        const imageUrl = await updateUserImage(userId, result.data.image, imageType);

        return {
            ...createFormResult(result.data, null, true),
            imageUrl
        }
    } catch (error) {
        console.error('Failed to update user image', error);

        return {
            ...createFormResult(result.data, MESSAGES.genericError, false),
            imageUrl: null
        }
    }
}

async function updateBioField(userId: string, field: string, value: string | Date) {
    const supabase = await createClient();

    await baseFetcher(
        supabase.from('biography')
            .update({ [field]: value })
            .eq('user_id', userId)
    )
}

async function deleteBioField(userId: string, field: string) {
    const supabase = await createClient();
    await baseFetcher(
        supabase.from('biography')
            .update({ [field]: null })
            .eq('user_id', userId)
    )
}

export async function updateUserBioAction(field: string, dbField: string, state: ActionState, formData: FormData) {
    const userId = await getUserId();

    const data = {
        [field]: formData.get(field)
    }

    const result = updateBioSchemas[field as keyof typeof updateBioSchemas].safeParse(data);

    if (!result.success) {
        return createFormResult(data as UpdateHometownSchemaType, result.error.formErrors as UpdateHometownSchemaErrorType, false)
    }

    const fieldValue = (result.data as Record<string, string | Date>)[field];

    if (fieldValue === state.data[field]) {
        return createFormResult(result.data, null, false);
    }

    try {
        await updateBioField(userId, dbField, fieldValue);
        revalidateTag(`user-profile-${userId}`);
        return createFormResult(result.data, null, true);
    } catch (error) {
        console.error('Failed to update user bio', error);
        return createFormResult(data as UpdateHometownSchemaType, MESSAGES.genericError, false)
    }
}

export async function deleteUserBioFieldAction(field: string) {
    const userId = await getUserId();

    try {
        await deleteBioField(userId, field);
        revalidateTag(`user-profile-${userId}`);
        return {
            error: null,
            success: true
        }
    } catch (error) {
        console.error('Failed to delete user bio field', error);
        return {
            error: MESSAGES.genericError,
            success: false
        }
    }
}