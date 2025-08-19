import { createComment, deleteCommentAction, editComment as editCommentAction } from "@/lib/actions/comment/comment.actions";
import { fetchPostComments } from "@/lib/client/post.client";
import { CommentType } from "@/lib/types/post";
import { startTransition, useCallback, useEffect, useOptimistic, useState } from "react";


const addCommentState = (comments: CommentType[], comment: CommentType) => [comment, ...comments];

const editCommentState = (comments: CommentType[], commentId: string, newContent: string) => {
    return comments.map((comment) => comment.id === commentId ? { ...comment, body: newContent } : comment);
}

const deleteCommentState = (comments: CommentType[], commentId: string) => comments.filter((comment) => comment.id !== commentId);

export default function useComments(
    isDetailedViewOpen: boolean,
    postId: string,
    updateCommentsCount: (type: 'add' | 'remove') => void,
) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [optimisticComments, updateOptimisticComments] = useOptimistic(comments);
    const [isLoading, setIsLoading] = useState(false);

    const addComment = useCallback((comment: CommentType) => {
        startTransition(async () => {
            updateOptimisticComments((prevState) => addCommentState(prevState, comment));
            updateCommentsCount('add');

            const newComment = await createComment(comment.authorId, postId, comment.body);

            startTransition(() => {
                setComments((prevComments) => addCommentState(prevComments, newComment));
            })
        })
    }, [postId, updateCommentsCount, updateOptimisticComments, setComments]);

    const editComment = useCallback(async (commentId: string, newContent: string) => {
        startTransition(async () => {
            updateOptimisticComments((prevState) => editCommentState(prevState, commentId, newContent))
            await editCommentAction(commentId, newContent);

            startTransition(() => {
                setComments((prevComments) => prevComments.map((comment) => comment.id === commentId ? { ...comment, body: newContent } : comment));
            })
        })
    }, []);

    const deleteComment = useCallback(async (commentId: string) => {
        startTransition(async () => {
            updateOptimisticComments((prevState) => deleteCommentState(prevState, commentId));
            updateCommentsCount('remove');

            await deleteCommentAction(commentId);

            startTransition(() => {
                setComments((prevComments) => deleteCommentState(prevComments, commentId));
            })
        })
    }, [updateCommentsCount, updateOptimisticComments, setComments]);

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

    return { comments: optimisticComments, addComment, editComment, deleteComment, reactionComment, isLoading };
}