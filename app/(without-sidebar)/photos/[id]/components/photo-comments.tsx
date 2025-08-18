'use client';

import Comment from "@/components/comment";
import { photoCommentReaction } from "@/lib/actions/photos/photos.actions";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { CommentType } from "@/lib/types/post";
import { DeleteCommentType, EditCommentType } from "../lib/types";

type PhotoCommentsProps = {
    comments: CommentType[];
    editPhotoComment: EditCommentType;
    deletePhotoComment: DeleteCommentType;
}

export default function PhotoComments({ comments, editPhotoComment, deletePhotoComment }: Readonly<PhotoCommentsProps>) {
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
                        commentReaction={() => photoCommentReaction({ commentId: comment.id, userId: user.id, isLikedComment: isLikedComment })}
                    />
                )
            })}
        </div>
    )
}