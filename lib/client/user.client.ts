import { BaseUserType, PresenceStatusType, SearchUserType, UserProfileDBType, UserProfileType } from "../types/user";
import { createClient } from "../utils/supabase/client";
import { baseFetcher } from "../utils/supabase/helpers";
import { baseUserQuery, userQueryWithBiography } from "../utils/supabase/queries";
import { appendFullNameToUser, transformSearchUser } from "../utils/transform";

export async function updateUserStatus(newStatus: PresenceStatusType, userId: string) {
    const supabase = createClient();
    await supabase.from('users').update({
        presence_status: newStatus,
        last_seen: new Date()
    }).eq('id', userId);
}

export async function fetchUserProfile(userId: string) {
    const supabase = createClient();

    const data = await baseFetcher<UserProfileDBType>(
        supabase.from('users')
            .select(userQueryWithBiography)
            .eq('id', userId)
            .single()
    );
    return appendFullNameToUser(data) as UserProfileType;
}

export async function fetchBaseUser(userId: string) {
    const supabase = createClient();
    const data = await baseFetcher(
        supabase.from('users').select(baseUserQuery).eq('id', userId).single()
    )

    return appendFullNameToUser(data) as BaseUserType;
}

export async function searchUsers(search: string) {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .rpc("match_full_name", { search: `%${search}%` });

        if (error) {
            throw error;
        }

        return data.map(transformSearchUser);
    } catch (error) {
        console.error("Error searching users", error);
        return [];
    }
}