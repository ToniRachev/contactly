'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { UserDBType } from "@/lib/types/user";
import { transformUserData } from "@/lib/utils/transform";

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