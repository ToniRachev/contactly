'use server';

import { MESSAGES } from "@/lib/constants/messages";
import { baseFetcher } from "../../helpers";
import { createClient } from "../../server";
import { transformPosts } from "../../utils/transform";
import { PostSchemaErrorType, PostSchemaType } from "../../validations/postSchema";
import { createFormResult } from "../../validations/utils";
import { getUserId } from "../user/user";
import { parseAndValidateSubmitPostData } from "./helpers";
import { PostType } from "../../types/post";

export const fetchPosts = async (currentUserId: string, limit: number = 10) => {
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

export const fetchUserPosts = async (userId: string, limit: number = 10) => {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('posts')
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`)
            .eq('author_id', userId)
            .limit(limit)
            .order('created_at', { ascending: false })
    );

    return transformPosts(data);
}

export const createPost = async (authorId: string, body: string) => {
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

    const transformedPost = transformPosts(data);
    return transformedPost[0];
}

export const editPost = async (postId: string, postContent: string) => {
    const supabase = await createClient();
    const userId = await getUserId();

    const data = await baseFetcher(
        supabase.from('posts')
            .update({ body: postContent })
            .match({ id: postId, author_id: userId })
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`));

    const transformedPost = transformPosts(data);
    return transformedPost[0];
}

export const deletePost = async (postId: string) => {
    try {
        const supabase = await createClient();
        const userId = await getUserId();

        await baseFetcher(supabase.from('posts').delete().match({ id: postId, author_id: userId }))
    } catch (error) {
        console.error('Error deleting post', error);
    }
}


type PostState = {
    data: PostSchemaType;
    errors: PostSchemaErrorType;
    success: boolean;
}

type SubmitPostState = PostState & { newPost: PostType | null }

export async function submitPost(state: SubmitPostState, formData: FormData) {
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

        return {
            data: '' as unknown as PostSchemaType,
            success: true,
            newPost,
            errors: {} as PostSchemaErrorType
        }
    } catch (error) {
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

export const deletePostAction = async (postId: string) => {
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