import { baseFetcher } from "../utils/supabase/helpers";
import { createClient } from "../utils/supabase/client";
import { transformConversationOverview } from "../utils/transform";

export async function getConversationOverview(conversationId: string, userId: string) {
    const supabase = createClient();

    const data = await baseFetcher(
        supabase.from('conversation_overview')
            .select(`*, conversation_participants:conversation_id(user1:user1_id(*), user2:user2_id(*))`)
            .eq('conversation_id', conversationId)
            .eq('user_id', userId)
    )

    return transformConversationOverview(data[0], userId);
}