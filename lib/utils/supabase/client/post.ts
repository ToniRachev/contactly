import { createClient } from "../client"
import { baseFetcher } from "../helpers";
import { CommentType } from "../types/post";
import { transformPostComments } from "../utils/transform";

export const fetchPostComments = async (postId: string): Promise<CommentType[]> => {
    const supabase = createClient();

    const data = await baseFetcher(
        supabase.from('comments')
            .select(`*, author:author_id(*), likes:likes_comments(user:user_id), likesCount:likes_comments(count)`)
            .eq('post_id', postId)
    )

    return transformPostComments(data);
}