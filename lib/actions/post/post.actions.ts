'use server';

import { MESSAGES } from "@/lib/constants/messages";
import { parseAndValidateFormData } from "@/lib/utils";
import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { transformPosts } from "@/lib/utils/transform";
import { postSchema, PostSchemaErrorType, PostSchemaType } from "@/lib/validations/postSchema";
import { createFormResult } from "@/lib/validations/utils";
import { PostType } from "@/lib/types/post";
import { getUserId } from "@/lib/actions/user/user.actions";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type PostState = {
    data: PostSchemaType;
    errors: PostSchemaErrorType;
    success: boolean;
}

type SubmitPostState = PostState & { newPost: PostType | null }

export async function fetchPosts(currentUserId: string, limit: number = 10) {
    const supabase = await createClient();
    const userId = await getUserId();

    const data = await baseFetcher(
        supabase.from('posts')
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`)
            .neq('author_id', currentUserId)
            .limit(limit)
            .order('created_at', { ascending: false })
    );

    return transformPosts(data, userId);
}

export async function fetchUserPosts(userId: string, limit: number = 10) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('posts')
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`)
            .eq('author_id', userId)
            .limit(limit)
            .order('created_at', { ascending: false })
    );

    return transformPosts(data, userId);
}

export async function createPost(authorId: string, body: string) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase
            .from('posts')
            .insert([{
                author_id: authorId,
                body
            }])
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`)
    )

    const transformedPost = transformPosts(data, authorId);
    return transformedPost[0];
}

export async function editPost(postId: string, postContent: string) {
    const supabase = await createClient();
    const userId = await getUserId();

    const data = await baseFetcher(
        supabase.from('posts')
            .update({ body: postContent })
            .match({ id: postId, author_id: userId })
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`));

    const transformedPost = transformPosts(data, userId);
    return transformedPost[0];
}

export const deletePost = async (postId: string) => {
    const supabase = await createClient();
    const userId = await getUserId();

    await baseFetcher(supabase.from('posts').delete().match({ id: postId, author_id: userId }))
}

export async function submitPost(path: string, state: SubmitPostState, formData: FormData) {
    const { data, result } = parseAndValidateFormData(formData, postSchema, [
        'body'
    ]);

    if (!result.success) {
        return {
            ...createFormResult(data as PostSchemaType, result.error.formErrors as PostSchemaErrorType, false),
            newPost: null,
        }
    }

    try {
        const userId = await getUserId();
        const newPost = await createPost(userId, result.data.body);

        if (path === '/') {
            redirect('/profile');
        }

        return {
            ...createFormResult({ body: '' } as PostSchemaType, null, true),
            newPost,
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        console.error('Failed to create post', error);
        return {
            ...createFormResult(data as PostSchemaType, MESSAGES.genericError, false),
            newPost: null,
        }
    }
}

export async function editPostAction(postId: string, state: PostState, formData: FormData) {
    const { data, result } = parseAndValidateFormData(formData, postSchema, [
        'body'
    ]);

    if (!result.success) {
        return {
            ...createFormResult(data as PostSchemaType, result.error.formErrors as PostSchemaErrorType, false),
            success: false,
        }
    }

    if (state.data.body === result.data.body) {
        return createFormResult(result.data, {} as PostSchemaErrorType, false)
    }

    try {
        await editPost(postId, result.data.body);
        return createFormResult(result.data, {} as PostSchemaErrorType, true)
    } catch (error) {
        console.error('Failed to edit post', error);
        return createFormResult(result.data, MESSAGES.genericError, false)
    }
}

export async function deletePostAction(postId: string) {
    try {
        await deletePost(postId)

        return {
            success: true,
            error: null
        }

    } catch (error) {
        console.error('Failed to delete post', error);
        return {
            success: false,
            error: MESSAGES.genericError
        }
    }
}
