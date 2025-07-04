'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { getUserId } from "@/lib/actions/user/user.actions";

export async function likePost(postId: string, userId: string) {
    const supabase = await createClient();

    await baseFetcher(
        supabase.from('likes_posts')
            .insert([{
                post_id: postId,
                user_id: userId
            }])
    )
}

export async function unlikePost(postId: string, userId: string) {
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

export async function likeComment(commentId: string, userId: string) {
    const supabase = await createClient();

    await baseFetcher(
        supabase.from('likes_comments')
            .insert([{
                comment_id: commentId,
                user_id: userId
            }])
    )
}

export async function unlikeComment(commentId: string, userId: string) {
    const supabase = await createClient();

    await baseFetcher(
        supabase.from('likes_comments')
            .delete()
            .match({ comment_id: commentId, user_id: userId })
    )
}