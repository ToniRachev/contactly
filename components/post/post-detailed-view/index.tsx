'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Post from "@/components/post/post"
import { Separator } from "@/components/ui/separator";
import Filter from "@/components/filter";
import { CommentType, PostType } from "@/lib/types/post";
import CreateComment from "@/components/post/post-detailed-view/create-comment";
import Comment from "@/components/post/post-detailed-view/comment";

const filters = [
    {
        value: 'mostLiked',
        label: 'Most liked',
        caption: 'Showing top comments that received the most love.'
    },
    {
        value: 'mostRecent',
        label: 'Most recent',
        caption: 'What people are saying right now.'
    }
]

type Controls = {
    setState: (state: boolean) => void;
    open: boolean;
}

type PostViewProps = {
    post: PostType;
    controls: Controls;
    reaction: () => void;
    commentState: {
        isLikedPost: boolean;
        comments: CommentType[];
        addComment: (comment: CommentType) => void;
        editComment: (commentId: string, newContent: string) => void;
        deleteComment: (commentId: string) => void;
        reactionComment: (commentId: string, userId: string, isLikedComment: boolean) => void;
        commentsLoading: boolean;
    }
}

export function PostDetailedView(
    {
        post,
        controls,
        reaction,
        commentState
    }: Readonly<PostViewProps>) {
    return (
        <Dialog open={controls.open} onOpenChange={controls.setState}>
            <DialogContent className="min-w-[50vw] border-none">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>Post view</DialogTitle>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col gap-4 relative max-h-[80vh] overflow-y-auto pr-4
                      [&::-webkit-scrollbar]:w-2 
                    [&::-webkit-scrollbar-track]:bg-surface
                    [&::-webkit-scrollbar-thumb]:bg-[#8C8C8C]
                    [&::-webkit-scrollbar-button]:hidden
                ">
                    <Post post={post} reaction={reaction} isLikedPost={commentState.isLikedPost} />

                    <Separator className="opacity-25" />
                    <Filter filters={filters} />


                    {commentState.comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            editComment={commentState.editComment}
                            deleteComment={commentState.deleteComment}
                            reactionComment={commentState.reactionComment}
                        />
                    ))}

                    <CreateComment postId={post.postId} addComment={commentState.addComment} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
