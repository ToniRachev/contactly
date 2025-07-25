'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { transformConversationOverview } from "@/lib/utils/transform";

export async function getConversations(userId: string) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('conversation_overview')
            .select(`*, conversation_participants:conversation_id(user1:user1_id(*), user2:user2_id(*))`)
            .eq('user_id', userId)
            .not('last_message_id', 'is', null)
    )

    return data.map((overview) => transformConversationOverview(overview, userId));
}