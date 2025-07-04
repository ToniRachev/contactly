import { createClient } from "@/lib/utils/supabase/client"
import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { CommentType } from "@/lib/types/post";
import { transformPostComments } from "@/lib/utils/transform";

export const fetchPostComments = async (postId: string): Promise<CommentType[]> => {
    const supabase = createClient();

    const data = await baseFetcher(
        supabase.from('comments')
            .select(`*, author:author_id(*), likes:likes_comments(user:user_id), likesCount:likes_comments(count)`)
            .eq('post_id', postId)
            .order('created_at', { ascending: false })
    )

    return transformPostComments(data);
}