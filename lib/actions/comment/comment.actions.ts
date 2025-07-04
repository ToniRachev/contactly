import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { transformPostComments } from "@/lib/utils/transform";
import { CommentSchemaErrorType, CommentSchemaType } from "@/lib/validations/postSchema";
import { createFormResult } from "@/lib/validations/utils";
import { parseAndValidateSubmitCommentData } from "@/lib/actions/post/post.helpers";
import { CommentType } from "@/lib/types/post";
import { MESSAGES } from "@/lib/constants/messages";

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