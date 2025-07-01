'use client';

import { Heart, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import UserAvatar from "../user-avatar"
import { PostType } from "@/lib/utils/supabase/types/post";
import { formatRelativeTime } from "@/lib/utils";
import DeletePost from "../delete-post";
import EditPost from "../edit-post";
import { ReactNode, useActionState, useEffect, useRef } from "react";
import { useUser } from "@/lib/context/user";
import clsx from "clsx";
import { postReaction } from "@/lib/utils/supabase/actions/post/post.actions";
import { usePosts } from "@/lib/context/posts";

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
    icon: ReactNode;
    count: number;
}

const ReactionItem = ({ icon, count }: ReactionItemProps) => {
    return (
        <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-600 p-2 rounded-full">
            {icon}
            <p>{count}</p>
        </div>
    )
}

type PostReactionsProps = {
    postId: string;
    commentsCount: number;
    likesCount: number;
    likes: string[];
    open?: () => void;
}

const PostReactions = ({ postId, commentsCount, likesCount, likes, open }: PostReactionsProps) => {
    const { user } = useUser();

    const isLikedPost = user?.id ? likes.includes(user.id) : false;

    const { postReaction: postReactionState } = usePosts();

    const postReactionWithPostId = postReaction.bind(null, postId, isLikedPost);
    const [state, formAction, isPending] = useActionState(postReactionWithPostId, {
        success: false,
        timestamp: 0
    });

    const prevTimestampRef = useRef(0);

    useEffect(() => {
        if (state.success && user && state.timestamp > prevTimestampRef.current) {
            postReactionState(postId, user.id, isLikedPost);
            prevTimestampRef.current = state.timestamp;
        }
    }, [state.success, state.timestamp, user, postId, postReactionState, isLikedPost])

    return (
        <div className="flex gap-4">
            <form>
                <button formAction={formAction} disabled={isPending}>
                    <ReactionItem
                        icon={<Heart className={clsx('', isLikedPost && 'stroke-red-500 fill-red-700')} />}
                        count={likesCount}
                    />
                </button>
            </form>

            <button onClick={open}>
                <ReactionItem
                    icon={<MessageCircle />}
                    count={commentsCount}
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
                postId={post.postId}
                commentsCount={post.commentsCount}
                likesCount={post.likesCount}
                open={open}
                likes={post.likes}
            />
        </div>
    )
}