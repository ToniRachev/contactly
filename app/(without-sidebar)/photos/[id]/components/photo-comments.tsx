'use client';

import Comment from "@/components/comment";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { CommentType } from "@/lib/types/post";
import { DeleteCommentType, EditCommentType, ReactionPhotoCommentType } from "../lib/types";

type PhotoCommentsProps = {
    comments: CommentType[];
    editPhotoComment: EditCommentType;
    deletePhotoComment: DeleteCommentType;
    reactionPhotoComment: ReactionPhotoCommentType;
}

export default function PhotoComments({ comments, editPhotoComment, deletePhotoComment, reactionPhotoComment }: Readonly<PhotoCommentsProps>) {
    const { user } = useAuthenticatedUser();
    return (
        <div className="pt-4">
            {comments.map((comment) => {
                const isLikedComment = comment.likes.some((like) => like === user.id);
                return (
                    <Comment
                        key={comment.id}
                        author={comment.author}
                        comment={comment}
                        editComment={(commentId, newContent) => editPhotoComment(comment.entityId, commentId, newContent)}
                        deleteComment={(commentId: string) => deletePhotoComment(comment.entityId, commentId)}
                        commentReaction={() => reactionPhotoComment(comment.entityId, comment.id, user.id, isLikedComment)}
                    />
                )
            })}
        </div>
    )
}