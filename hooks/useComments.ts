import { fetchPostComments } from "@/lib/utils/supabase/client/post.client";
import { CommentType } from "@/lib/types/post";
import { useCallback, useEffect, useState } from "react";

export default function useComments(
    isDetailedViewOpen: boolean,
    postId: string,
    updateCommentsCount: (type: 'add' | 'remove') => void,
) {
    const [comments, setComments] = useState<CommentType[]>([]);

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

    useEffect(() => {
        if (isDetailedViewOpen) {
            (async function () {
                const comments = await fetchPostComments(postId);
                setComments(comments);
            })()
        }
    }, [isDetailedViewOpen, postId]);


    return { comments, addComment, editComment, deleteComment };
}