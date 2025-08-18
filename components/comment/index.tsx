'use client';

import { useAuthenticatedUser } from "@/lib/context/user.context";
import { CommentType } from "@/lib/types/post";
import { useState } from "react";
import Avatar from "@/components/user-avatar";
import CommentControls from "@/components/comment/components/comment-controls";
import { formatRelativeTime } from "@/lib/utils";
import ReactionItem from "@/components/reaction/reaction-item";
import { ThumbsUp } from "lucide-react";
import clsx from "clsx";
import { BaseUserType } from "@/lib/types/user";
import EditCommentForm from "./components/edit-comment";

type ReactCommentProps = {
    comment: CommentType;
    isLikedComment: boolean;
    reactionComment: (commentId: string, userId: string, isLikedComment: boolean) => void;
    userId: string;
}


const ReactComment = ({ comment, isLikedComment, reactionComment, userId }: Readonly<ReactCommentProps>) => {

    const handleCommentReaction = () => {
        reactionComment(comment.id, userId, isLikedComment);
    }

    return (
        <div className="flex gap-2 items-center">
            <form>
                <button
                    formAction={handleCommentReaction}
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

type CommentProps = {
    author: BaseUserType;
    comment: CommentType;
    editComment: (commentId: string, newContent: string) => void;
    deleteComment: (commentId: string) => void;
    commentReaction: (commentId: string, userId: string, isLikedComment: boolean) => void;
}

export default function Comment({ author, comment, editComment, deleteComment, commentReaction }: Readonly<CommentProps>) {
    const [isEditing, setIsEditing] = useState(false);

    const { user } = useAuthenticatedUser();

    const isLikedComment = comment.likes.some((userLikedCommentId) => userLikedCommentId === user.id);
    const isCommentAuthor = user.id === comment.author.id;

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex gap-2 w-full">
                <Avatar
                    avatar={author.avatarUrl}
                    size={'sm'}
                />

                <div className="w-full">
                    <div className="bg-surface w-full p-4 rounded-lg flex justify-between">
                        <div className="w-full">
                            <p className="text-sm pb-4">{author.fullName}</p>

                            {!isEditing ? (
                                <p>{comment.body}</p>
                            ) : (
                                <EditCommentForm
                                    comment={comment}
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
                            reactionComment={commentReaction}
                            userId={user.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}