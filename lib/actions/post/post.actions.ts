'use server';

import { MESSAGES } from "@/lib/constants/messages";
import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { transformPosts } from "@/lib/utils/transform";
import { PostSchemaErrorType, PostSchemaType } from "@/lib/validations/postSchema";
import { createFormResult } from "@/lib/validations/utils";
import { parseAndValidateSubmitPostData } from "@/lib/actions/post/post.helpers";
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
    const { data, result } = parseAndValidateSubmitPostData(formData);

    if (!result.success) {
        const formResult = createFormResult(data as PostSchemaType, result.error.formErrors as PostSchemaErrorType)
        return {
            data: formResult.data,
            errors: formResult.errors,
            success: false,
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
            data: '' as unknown as PostSchemaType,
            success: true,
            newPost,
            errors: {} as PostSchemaErrorType
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        console.error('Failed to create post', error);
        const formResult = createFormResult(data as PostSchemaType, MESSAGES.genericError);

        return {
            data: formResult.data,
            errors: formResult.errors,
            success: false,
            newPost: null,
        }
    }
}

export async function editPostAction(postId: string, state: PostState, formData: FormData) {
    const { data, result } = parseAndValidateSubmitPostData(formData);

    if (!result.success) {
        const formResult = createFormResult(data as PostSchemaType, result.error.formErrors as PostSchemaErrorType);

        return {
            ...formResult,
            success: false,
        }
    }

    if (state.data.body === result.data.body) {
        const formResult = createFormResult(result.data, {} as PostSchemaErrorType)
        return {
            ...formResult,
            success: false,
        }
    }

    try {
        await editPost(postId, result.data.body);
        const formResult = createFormResult(result.data, {} as PostSchemaErrorType);

        return {
            ...formResult,
            success: true,
        }
    } catch (error) {
        console.error('Failed to edit post', error);
        const formResult = createFormResult(result.data, MESSAGES.genericError);
        return {
            ...formResult,
            success: false,
        }
    }
}

export async function deletePostAction(postId: string) {
    try {
        await deletePost(postId)

        return {
            success: true,
        }

    } catch (error) {
        console.error('Failed to delete post', error);
        return {
            success: false
        }
    }
}
