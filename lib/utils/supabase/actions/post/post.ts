'use server';

import { baseFetcher } from "../../helpers";
import { createClient } from "../../server";
import { transformFeed } from "../../utils/transform";

export const fetchFeed = async (currentUserId: string, limit: number = 10) => {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('posts')
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`)
            .neq('author_id', currentUserId)
            .limit(limit)
            .order('created_at', { ascending: false })
    );

    return transformFeed(data);
}
