import { Heart, LucideIcon, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import UserAvatar from "./user-avatar"
import { FeedType } from "@/lib/utils/supabase/types/post";
import { formatFullName, formatRelativeTime } from "@/lib/utils";
import DeletePost from "./delete-post";
import EditPost from "./edit-post";

type PostAuthorProps = {
    author: {
        firstName: string;
        lastName: string;
    }
    createdAt: string;
    isOwnPost: boolean;
    postId: string;
}

//TODO: Check if user and post author are friends

const PostAuthor = ({ author, createdAt, isOwnPost, postId }: PostAuthorProps) => {
    let controls;

    if (isOwnPost) {
        controls = (
            <div className="grid grid-cols-2 gap-2">
                <EditPost />
                <DeletePost postId={postId} />
            </div>
        )
    } else {
        controls = (<div>
            <Button className="bg-stone-600 hover:bg-stone-500 min-w-[5vw]">
                Add friend
            </Button>
        </div>)
    }

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <UserAvatar
                    width={100}
                    height={100}
                />
                <div>
                    <h6>{formatFullName(author.firstName, author.lastName)}</h6>
                    <p>{formatRelativeTime(createdAt)}</p>
                </div>
            </div>

            {controls}
        </div>
    )
}

type PostContentProps = {
    content: string;
}

const PostContent = ({ content }: PostContentProps) => {
    return (
        <div>
            <p>{content}</p>
        </div>
    )
}


type ReactionItemProps = {
    icon: LucideIcon;
    count: number;
}

const ReactionItem = ({ icon, count }: ReactionItemProps) => {
    const Icon = icon;

    return (
        <div className="flex items-center gap-1 cursor-pointer">
            <Icon />
            <p>{count}</p>
        </div>
    )
}

type PostReactionsProps = {
    comments: number;
    likes: number;
    open?: () => void;
}

const PostReactions = ({ comments, likes, open }: PostReactionsProps) => {
    return (
        <div className="flex gap-4">
            <ReactionItem
                icon={Heart}
                count={likes}
            />

            <button onClick={open}>
                <ReactionItem
                    icon={MessageCircle}
                    count={comments}
                />
            </button>
        </div>
    )
}

type PostProp = {
    post: FeedType;
    userId: string;
    open?: () => void;
}

export default function Post({
    post,
    userId,
    open,
}: Readonly<PostProp>) {
    return (
        <div className="flex flex-col gap-4">
            <PostAuthor
                author={{ ...post.author }}
                createdAt={post.createdAt}
                isOwnPost={userId === post.author.id}
                postId={post.postId}
            />

            <PostContent
                content={post.body}
            />

            <PostReactions
                comments={post.commentsCount}
                likes={post.likesCount}
                open={open}
            />
        </div>
    )
}