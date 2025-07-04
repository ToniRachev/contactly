'use server';

import { MESSAGES } from "@/lib/constants/messages";
import { baseFetcher } from "../../helpers";
import { createClient } from "../../server";
import { transformPostComments, transformPosts } from "../../utils/transform";
import { CommentSchemaErrorType, CommentSchemaType, PostSchemaErrorType, PostSchemaType } from "../../validations/postSchema";
import { createFormResult } from "../../validations/utils";
import { parseAndValidateSubmitCommentData, parseAndValidateSubmitPostData } from "./helpers";
import { CommentType, PostType } from "../../types/post";
import { getUserId } from "../user/user.actions";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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

    return transformPosts(data, userId);
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

    const transformedPost = transformPosts(data, authorId);
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

    const transformedPost = transformPosts(data, userId);
    return transformedPost[0];
}

export const deletePost = async (postId: string) => {
    const supabase = await createClient();
    const userId = await getUserId();

    await baseFetcher(supabase.from('posts').delete().match({ id: postId, author_id: userId }))
}


type PostState = {
    data: PostSchemaType;
    errors: PostSchemaErrorType;
    success: boolean;
}

type SubmitPostState = PostState & { newPost: PostType | null }

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

const createComment = async (authorId: string, postId: string, body: string) => {
    const supabase = await createClient();

    const data = await baseFetcher(supabase.from('comments')
        .insert([{
            post_id: postId,
            author_id: authorId,
            body
        }])
        .select(`*, author:author_id(*), likes:likes_comments(user:user_id), likesCount:likes_comments(count)`)
    )

    const transformedComment = transformPostComments(data);

    return transformedComment[0];
}

type CommentState = {
    data: CommentSchemaType;
    errors: CommentSchemaErrorType;
    success: boolean;
    newComment: CommentType | null;
}

export const createCommentAction = async (postId: string, authorId: string, state: CommentState, formData: FormData) => {
    const { data, result } = parseAndValidateSubmitCommentData(formData);

    if (!result.success) {
        const formResult = createFormResult(data as CommentSchemaType, result.error.formErrors as CommentSchemaErrorType)

        return {
            ...formResult,
            success: false,
            newComment: null,
        }
    }

    try {
        const newComment = await createComment(authorId, postId, result.data.body);
        const formResult = createFormResult({ body: '' } as CommentSchemaType, {} as CommentSchemaErrorType);

        return {
            ...formResult,
            success: true,
            newComment
        }
    } catch (error) {
        console.error('Failed to create comment', error);
        const formResult = createFormResult(result.data as CommentSchemaType, MESSAGES.genericError);

        return {
            ...formResult,
            success: false,
            newComment: null,
        }
    }
}

export const editComment = async (authorId: string, commentId: string, body: string) => {
    const supabase = await createClient();

    await baseFetcher(supabase.from('comments')
        .update({ body })
        .match({ author_id: authorId, id: commentId })
        .select('*'))
}

type EditCommentState = {
    data: CommentSchemaType;
    errors: CommentSchemaErrorType;
    success: boolean;
}

export const editCommentAction = async (authorId: string, commentId: string, state: EditCommentState, formData: FormData) => {
    const { data, result } = parseAndValidateSubmitCommentData(formData);

    if (!result.success) {
        const formResult = createFormResult(data as CommentSchemaType, result.error.formErrors as CommentSchemaErrorType)

        return {
            ...formResult,
            success: false,
        }
    }

    try {
        await editComment(authorId, commentId, result.data.body);

        const formResult = createFormResult(result.data, {} as CommentSchemaErrorType);

        return {
            ...formResult,
            success: true,
        }

    } catch (error) {
        console.error('Failed to edit comment', error);
        const formResult = createFormResult(result.data as CommentSchemaType, MESSAGES.genericError);

        return {
            ...formResult,
            success: false,
        }
    }
}

export const deleteComment = async (authorId: string, commentId: string) => {
    const supabase = await createClient();

    await baseFetcher(supabase.from('comments').delete().match({ author_id: authorId, id: commentId }));
}

export const deleteCommentAction = async (authorId: string, commentId: string) => {
    try {
        await deleteComment(authorId, commentId);

        return {
            success: true,
        }
    } catch (error) {
        console.error('Failed to delete comment', error);
        return {
            success: false,
        }
    }
}