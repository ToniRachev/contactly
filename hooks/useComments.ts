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

    const editComment = useCallback((commentId: string, newContent: string) => {
        setComments((prevComments) => prevComments.map((comment) => comment.id === commentId ? { ...comment, body: newContent } : comment));
    }, []);

    const deleteComment = useCallback((commentId: string) => {
        const commentIndex = comments.findIndex((comment) => comment.id === commentId);

        if (commentIndex === -1) return;

        setComments((prevComments) => {
            const newComments = [...prevComments];
            newComments.splice(commentIndex, 1);
            return newComments;
        })

        updateCommentsCount('remove');
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