'use client';

import { useAuthenticatedUser } from "@/lib/context/user.context";
import { CommentType } from "@/lib/types/post";
import Avatar from "@/components/user-avatar";
import CommentForm from "./comment-form";
import { createOptimisticComment } from "@/lib/utils";

type CreateCommentProps = {
    postId: string;
    addComment: (comment: CommentType) => void;
}

export default function CreateComment({ postId, addComment }: Readonly<CreateCommentProps>) {
    const { user } = useAuthenticatedUser();

    const handleSubmitSuccess = async (content: string) => {
        const optimisticComment = createOptimisticComment({
            body: content,
            entityId: postId,
            user
        })

        addComment(optimisticComment);
    }

    return (
        <div className="w-full flex gap-2 items-center sticky bottom-0 bg-background py-4">
            <Avatar avatar={'/user_avatar.webp'} size={'sm'} />

            <CommentForm
                onSubmitSuccess={handleSubmitSuccess}
            />
        </div>
    )
}