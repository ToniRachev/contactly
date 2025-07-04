import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { getUserId } from "@/lib/actions/user/user.actions";

export const likePost = async (postId: string, userId: string) => {
    const supabase = await createClient();

    await baseFetcher(
        supabase.from('likes_posts')
            .insert([{
                post_id: postId,
                user_id: userId
            }])
    )
}

export const unlikePost = async (postId: string, userId: string) => {
    const supabase = await createClient();

    await baseFetcher(supabase.from('likes_posts')
        .delete()
        .match({ post_id: postId, user_id: userId })
    )
}

export async function postReaction(postId: string, isLikedPost: boolean) {
    const userId = await getUserId();

    try {
        if (isLikedPost) {
            await unlikePost(postId, userId)
        } else {
            await likePost(postId, userId);
        }

        return {
            success: true,
        }

    } catch (error) {
        console.error('Failed to like post', error);
        return {
            success: false,
        }
    }
}