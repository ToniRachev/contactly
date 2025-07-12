'use client';

import { useAuthenticatedUser } from "@/lib/context/user.context";
import { useActionState, useEffect, useRef } from "react";
import { createCommentAction } from "@/lib/actions/comment/comment.actions";
import { CommentSchemaErrorType, CommentSchemaType } from "@/lib/validations/postSchema";
import { CommentType } from "@/lib/types/post";
import Avatar from "@/components/user-avatar";
import CommentForm from "./comment-form";

type CreateCommentProps = {
    postId: string;
    addComment: (comment: CommentType) => void;
}

export default function CreateComment({ postId, addComment }: Readonly<CreateCommentProps>) {
    const { user } = useAuthenticatedUser();
    const formRef = useRef<HTMLFormElement>(null);

    const createCommentActionWithUserAndPostId = createCommentAction.bind(null, postId, user.id);

    const [state, formAction, isPending] = useActionState(createCommentActionWithUserAndPostId, {
        data: {
            body: '',
        } as CommentSchemaType,
        errors: {} as CommentSchemaErrorType,
        newComment: null,
        success: false
    })

    const error = state.errors.fieldErrors?.body?.[0] ?? state.errors.formErrors?.[0];

    useEffect(() => {
        if (state.success) {
            addComment(state.newComment as CommentType);
        }
    }, [state.success, addComment, state.newComment])

    return (
        <div className="w-full flex gap-2 items-center sticky bottom-0 bg-background py-4">
            <Avatar avatar={'/user_avatar.webp'} size={'sm'} />

            <CommentForm
                formRef={formRef}
                formAction={formAction}
                isPending={isPending}
                value={state.data.body}
                error={error}
            />
        </div>
    )
}