import { PresenceStatusType } from "../types/user";
import { createClient } from "../utils/supabase/client";

export async function updateUserStatus(newStatus: PresenceStatusType, userId: string) {
    const supabase = createClient();
    await supabase.from('users').update({
        presence_status: newStatus,
        last_seen: new Date()
    }).eq('id', userId);
}