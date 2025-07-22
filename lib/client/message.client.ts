import { baseFetcher } from "../utils/supabase/helpers";
import { createClient } from "../utils/supabase/client";
import { transformConversation } from "../utils/transform";

export async function createOrFindConversation(userIds: string[]) {
    const supabase = createClient();

    const [user1_id, user2_id] = userIds.toSorted((a, b) => a.localeCompare(b));

    const conversation = await baseFetcher(
        supabase.from('conversations').upsert({
            user1_id,
            user2_id
        }, {
            onConflict: 'user1_id,user2_id'
        }).select('*, messages(*)')
    )

    return transformConversation(conversation[0]);
}
