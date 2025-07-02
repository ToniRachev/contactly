import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Post from "./post"
import UserAvatar from "../user-avatar";
import { ThumbsUp } from "lucide-react";
import { Separator } from "../ui/separator";
import Filter from "../filter";
import MessageInput from "../message-input";
import { useEffect, useState } from "react";
import { fetchPostComments } from "@/lib/utils/supabase/client/post";
import { formatRelativeTime } from "@/lib/utils";
import { CommentType, PostType } from "@/lib/utils/supabase/types/post";

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
    isLikedPost: boolean;
}

const Comment = ({ comment }: Readonly<{ comment: CommentType }>) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 w-full">
                <UserAvatar
                    width={32}
                    height={32}
                />

                <div className="w-full">
                    <div className="bg-surface w-full p-4 rounded-lg">
                        <p className="text-sm pb-4">{comment.author.fullName}</p>
                        <p>{comment.body}</p>
                    </div>

                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p>{formatRelativeTime(comment.createdAt)}</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <ThumbsUp width={20} />
                            <span className="text-sm">{comment.likesCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function PostDetailedView({ post, controls, reaction, isLikedPost }: Readonly<PostViewProps>) {
    const [comments, setComments] = useState<CommentType[]>([]);

    useEffect(() => {
        if (controls.open) {
            (async function () {
                const comments = await fetchPostComments(post.postId);
                setComments(comments);
            })()
        }

        return () => setComments([]);
    }, [post.postId, controls.open])

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
                    <Post post={post} reaction={reaction} isLikedPost={isLikedPost} />

                    <Separator className="opacity-25" />
                    <Filter filters={filters} />

                    {comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} />
                    ))}

                    <div className="w-full flex gap-2 items-center sticky bottom-0 bg-background py-4">
                        <UserAvatar avatar={'/user_avatar.webp'} width={32} height={32} />

                        <MessageInput
                            placeholder="Add a comment..."
                            name="comment"
                            className="w-full"
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
