import { createClient } from "@/lib/utils/supabase/client"
import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { CommentDBType, CommentType } from "@/lib/types/post";
import { transformPostComments } from "@/lib/utils/transform";
import { commentQuery } from "../utils/supabase/queries";

export const fetchPostComments = async (postId: string): Promise<CommentType[]> => {
    const supabase = createClient();

    const data = await baseFetcher(
        supabase.from('comments')
            .select(commentQuery)
            .eq('post_id', postId)
            .order('created_at', { ascending: false })
    )

    return transformPostComments(data as unknown as CommentDBType[]);
}