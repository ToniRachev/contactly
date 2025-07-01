import { Heart, LucideIcon, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import UserAvatar from "../user-avatar"
import { PostType } from "@/lib/utils/supabase/types/post";
import { formatRelativeTime } from "@/lib/utils";
import DeletePost from "../delete-post";
import EditPost from "../edit-post";

type PostAuthorProps = {
    post: PostType;
}

//TODO: Check if user and post author are friends

const PostAuthor = ({ post }: PostAuthorProps) => {
    let controls;

    if (post.postOwner) {
        controls = (
            <div className="grid grid-cols-2 gap-2">
                <EditPost postId={post.postId} postContent={post.body} />
                <DeletePost postId={post.postId} />
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
                    <h6>{post.author.fullName}</h6>
                    <p>{formatRelativeTime(post.createdAt)}</p>
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
    post: PostType;
    open?: () => void;
}

export default function Post({
    post,
    open,
}: Readonly<PostProp>) {
    return (
        <div className="flex flex-col gap-4">
            <PostAuthor
                post={post}
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