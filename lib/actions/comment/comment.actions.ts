'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { transformPostComments } from "@/lib/utils/transform";
import { CommentSchemaErrorType, CommentSchemaType } from "@/lib/validations/postSchema";
import { createFormResult } from "@/lib/validations/utils";
import { parseAndValidateSubmitCommentData } from "@/lib/actions/post/post.helpers";
import { CommentType } from "@/lib/types/post";
import { MESSAGES } from "@/lib/constants/messages";

export async function createComment(authorId: string, postId: string, body: string) {
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

export async function createCommentAction(postId: string, authorId: string, state: CommentState, formData: FormData) {
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

export async function editComment(authorId: string, commentId: string, body: string) {
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

export async function editCommentAction(authorId: string, commentId: string, state: EditCommentState, formData: FormData) {
    const { data, result } = parseAndValidateSubmitCommentData(formData);

    if (!result.success) {
        const formResult = createFormResult(data as CommentSchemaType, result.error.formErrors as CommentSchemaErrorType)

        return {
            ...formResult,
            success: false,
        }
    }

    if (state.data.body === result.data.body) {
        const formResult = createFormResult(result.data, {} as CommentSchemaErrorType);

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

export async function deleteComment(authorId: string, commentId: string) {
    const supabase = await createClient();

    await baseFetcher(supabase.from('comments').delete().match({ author_id: authorId, id: commentId }));
}

export async function deleteCommentAction(authorId: string, commentId: string) {
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