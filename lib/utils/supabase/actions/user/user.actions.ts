'use server';

import { baseFetcher } from "../../helpers";
import { createClient } from "../../server";
import { UserDBType } from "../../types/user";
import { transformUserData } from "../../utils/transform";

export const fetchUserProfile = async (userId: string) => {
    const supabase = await createClient();

    const query = supabase.from('users')
        .select(`*, biography(*)`)
        .eq('id', userId)
        .single();

    const data = await baseFetcher<UserDBType>(query);

    return transformUserData(data);
}

export const getUserId = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw new Error('User ID not found but user should be authenticated')
    }

    return data.user.id;
}