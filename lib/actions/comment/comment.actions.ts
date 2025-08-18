'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { transformComment } from "@/lib/utils/transform";
import { commentSchema, CommentSchemaErrorType, CommentSchemaType } from "@/lib/validations/postSchema";
import { createFormResult } from "@/lib/validations/utils";
import { CommentDBType, CommentType } from "@/lib/types/post";
import { MESSAGES } from "@/lib/constants/messages";
import { parseAndValidateFormData } from "@/lib/utils";
import { commentQuery } from "@/lib/utils/supabase/queries";

export async function createComment(authorId: string, postId: string, body: string) {
    const supabase = await createClient();

    const data = await baseFetcher(supabase.from('comments')
        .insert([{
            post_id: postId,
            author_id: authorId,
            body
        }])
        .select(commentQuery)
        .single()
    )

    const transformedComment = transformComment(data as unknown as CommentDBType);

    return transformedComment;
}

type CommentState = {
    data: CommentSchemaType;
    errors: CommentSchemaErrorType;
    success: boolean;
    newComment: CommentType | null;
}

export async function createCommentAction(postId: string, authorId: string, state: CommentState, formData: FormData) {
    const { data, result } = parseAndValidateFormData(formData, commentSchema, [
        'body'
    ]);

    if (!result.success) {
        return {
            ...createFormResult(data as CommentSchemaType, result.error.formErrors as CommentSchemaErrorType, false),
            newComment: null,
        }
    }

    try {
        const newComment = await createComment(authorId, postId, result.data.body);

        return {
            ...createFormResult({ body: '' } as CommentSchemaType, null, true),
            newComment
        }
    } catch (error) {
        console.error('Failed to create comment', error);
        const formResult = createFormResult(result.data as CommentSchemaType, MESSAGES.genericError, false);

        return {
            ...formResult,
            newComment: null,
        }
    }
}

export async function editComment(commentId: string, body: string) {
    const supabase = await createClient();

    await baseFetcher(supabase.from('comments')
        .update({ body })
        .match({ id: commentId })
        .select('*'))
}

export async function deleteComment(commentId: string) {
    const supabase = await createClient();

    await baseFetcher(supabase.from('comments').delete().match({ id: commentId }));
}

export async function deleteCommentAction(commentId: string) {
    try {
        await deleteComment(commentId);
        return {
            success: true,
            error: null
        }
    } catch (error) {
        console.error('Failed to delete comment', error);
        return {
            success: false,
            error: MESSAGES.genericError
        }
    }
}   