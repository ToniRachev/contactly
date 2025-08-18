import { deleteCommentAction, editComment as editCommentAction } from "@/lib/actions/comment/comment.actions";
import { fetchPostComments } from "@/lib/client/post.client";
import { CommentType } from "@/lib/types/post";
import { useCallback, useEffect, useState } from "react";

export default function useComments(
    isDetailedViewOpen: boolean,
    postId: string,
    updateCommentsCount: (type: 'add' | 'remove') => void,
) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addComment = useCallback((comment: CommentType) => {
        setComments((prevComments) => [comment, ...prevComments]);
        updateCommentsCount('add');
    }, [updateCommentsCount]);

    const editComment = useCallback(async (commentId: string, newContent: string) => {
        try {
            await editCommentAction(commentId, newContent);
            setComments((prevComments) => prevComments.map((comment) => comment.id === commentId ? { ...comment, body: newContent } : comment));
        } catch (error) {
            console.error('Failed to edit comment', error);
        }
    }, []);

    const deleteComment = useCallback(async (commentId: string) => {
        const commentIndex = comments.findIndex((comment) => comment.id === commentId);

        if (commentIndex === -1) return;

        try {
            setComments((prevComments) => {
                const newComments = [...prevComments];
                newComments.splice(commentIndex, 1);
                return newComments;
            })
            updateCommentsCount('remove');

            await deleteCommentAction(commentId);
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    }, [updateCommentsCount, comments]);

    const reactionComment = useCallback((commentId: string, userId: string, isLikedComment: boolean) => {
        setComments((prevComments) => {
            return prevComments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        likes: isLikedComment ? comment.likes.filter((userLikedCommentId) => userLikedCommentId !== userId) : [...comment.likes, userId],
                        likesCount: isLikedComment ? comment.likesCount - 1 : comment.likesCount + 1
                    }
                }
                return comment;
            })
        })
    }, [])


    useEffect(() => {
        if (isDetailedViewOpen) {
            (async function () {
                setIsLoading(true);
                const comments = await fetchPostComments(postId);
                setComments(comments);
                setIsLoading(false);
            })()
        }
    }, [isDetailedViewOpen, postId]);

    return { comments, addComment, editComment, deleteComment, reactionComment, isLoading };
}