'use client';

import { useAuthenticatedUser } from "@/lib/context/user.context";
import { CommentType } from "@/lib/types/post";
import { useActionState, useEffect, useRef, useState } from "react";
import { commentReaction } from "@/lib/actions/likes/likes.actions";
import { editCommentAction } from "@/lib/actions/comment/comment.actions";
import { CommentSchemaType, CommentSchemaErrorType } from "@/lib/validations/postSchema";
import Avatar from "@/components/user-avatar";
import CommentForm from "./comment-form";
import CommentControls from "./comment-controls";
import { formatRelativeTime } from "@/lib/utils";
import ReactionItem from "@/components/reaction-item";
import { ThumbsUp } from "lucide-react";
import clsx from "clsx";

type CommentProps = {
    comment: CommentType;
    editComment: (commentId: string, newContent: string) => void;
    deleteComment: (commentId: string) => void;
    reactionComment: (commentId: string, userId: string, isLikedComment: boolean) => void;
}

type CommentFormProps = {
    formRef: React.RefObject<HTMLFormElement | null>;
    comment: CommentType;
    userId: string;
    editComment: (commentId: string, newContent: string) => void;
    closeEditing: () => void;
}

type ReactCommentProps = {
    comment: CommentType;
    isLikedComment: boolean;
    reactionComment: (commentId: string, userId: string, isLikedComment: boolean) => void;
    userId: string;
}

const EditCommentForm = ({ formRef, comment, userId, editComment, closeEditing }: Readonly<CommentFormProps>) => {
    const editCommentActionWithUserAndCommentId = editCommentAction.bind(null, userId, comment.id);

    const [state, formAction, isPending] = useActionState(editCommentActionWithUserAndCommentId, {
        data: {
            body: comment.body,
        } as CommentSchemaType,
        errors: {} as CommentSchemaErrorType,
        success: false
    })

    useEffect(() => {
        if (state.success) {
            editComment(comment.id, state.data.body);
            closeEditing();
        }
    }, [state.success, editComment, state.data.body, comment.id, closeEditing])

    return (
        <div className="w-full">
            <div className="w-full border p-2 rounded-lg border-stone-700">
                <CommentForm
                    formRef={formRef}
                    formAction={formAction}
                    value={state.data.body}
                    isPending={isPending}
                    error={state.errors?.fieldErrors?.body?.[0]}
                    className="w-full py-2 px-0 focus-visible:ring-0"
                />
            </div>

            <div className="py-2">
                <button onClick={closeEditing} className="text-sm text-red-500">Cancel</button>
            </div>
        </div>
    )
}

const ReactComment = ({ comment, isLikedComment, reactionComment, userId }: Readonly<ReactCommentProps>) => {
    const commentReactionActionWithUserAndCommentId = commentReaction.bind(null, comment.id, isLikedComment);

    const [, commentReactionAction, isCommentReactionPending] = useActionState(commentReactionActionWithUserAndCommentId, {
        success: false
    })

    const handleCommentReaction = () => {
        setTimeout(() => {
            reactionComment(comment.id, userId, isLikedComment);
        }, 0)
        commentReactionAction();
    }

    return (
        <div className="flex gap-2 items-center">
            <form>
                <button
                    formAction={handleCommentReaction}
                    disabled={isCommentReactionPending}
                >
                    <ReactionItem
                        icon={(
                            <ThumbsUp
                                width={20}
                                className={clsx(isLikedComment && 'fill-blue-500 stroke-blue-600')}
                            />
                        )}
                        count={comment.likesCount}
                    />
                </button>
            </form>
        </div>
    )
}

export default function Comment({ comment, editComment, deleteComment, reactionComment }: Readonly<CommentProps>) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isEditing, setIsEditing] = useState(false);

    const { user } = useAuthenticatedUser();

    const isLikedComment = comment.likes.some((userLikedCommentId) => userLikedCommentId === user.id);
    const isCommentAuthor = user.id === comment.author.id;

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex gap-2 w-full">
                <Avatar
                    avatar={comment.author.avatarUrl}
                    size={'sm'}
                />

                <div className="w-full">
                    <div className="bg-surface w-full p-4 rounded-lg flex justify-between">
                        <div className="w-full">
                            <p className="text-sm pb-4">{comment.author.fullName}</p>

                            {!isEditing ? (
                                <p>{comment.body}</p>
                            ) : (
                                <EditCommentForm
                                    formRef={formRef}
                                    comment={comment}
                                    userId={user.id}
                                    closeEditing={() => setIsEditing(false)}
                                    editComment={editComment}
                                />
                            )}
                        </div>

                        {isCommentAuthor && (
                            <CommentControls setIsEditing={setIsEditing} commentId={comment.id} deleteComment={deleteComment} />
                        )}
                    </div>

                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p>{formatRelativeTime(comment.createdAt)}</p>
                        </div>
                        <ReactComment
                            comment={comment}
                            isLikedComment={isLikedComment}
                            reactionComment={reactionComment}
                            userId={user.id}
                        />

                    </div>
                </div>
            </div>
        </div>
    )
}