import { baseFetcher } from "../utils/supabase/helpers";
import { createClient } from "../utils/supabase/client";
import { transformConversation } from "../utils/transform";

export async function createOrFindConversation(userIds: string[]) {
    const supabase = createClient();

    const [user1_id, user2_id] = userIds.toSorted((a, b) => a.localeCompare(b));

    const conversationData = await baseFetcher(
        supabase.from('conversations').upsert({
            user1_id,
            user2_id
        }, {
            onConflict: 'user1_id,user2_id'
        }).select('id').single()
    )

    const conversation = await baseFetcher(
        supabase.from('conversations')
            .select('*, messages(*), conversation_participants(*)')
            .eq('id', conversationData.id)
    )

    return transformConversation(conversation[0]);
}

export async function readMessage(conversationId: string, userId: string, lastMessageId: string) {
    const supabase = createClient();

    await baseFetcher(supabase.from('conversation_participants')
        .update({
            last_read_message_id: lastMessageId,
            last_read_at: new Date(),
        })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)
    )
}