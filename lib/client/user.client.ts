import { PresenceStatusType, UserProfileDBType } from "../types/user";
import { createClient } from "../utils/supabase/client";
import { baseFetcher } from "../utils/supabase/helpers";
import { transformUserProfile } from "../utils/transform";

export async function updateUserStatus(newStatus: PresenceStatusType, userId: string) {
    const supabase = createClient();
    await supabase.from('users').update({
        presence_status: newStatus,
        last_seen: new Date()
    }).eq('id', userId);
}

export async function fetchUserProfile(userId: string) {
    const supabase = createClient();
    const query = supabase.from('users')
        .select(`*, biography(*)`)
        .eq('id', userId)
        .single();

    const data = await baseFetcher<UserProfileDBType>(query);
    return transformUserProfile(data);
}