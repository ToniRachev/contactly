'use client';

import { Heart, MessageCircle } from "lucide-react";
import Avatar from "../user-avatar"
import { PostType } from "@/lib/types/post";
import { formatRelativeTime } from "@/lib/utils";
import DeletePost from "../delete-post";
import EditPost from "../edit-post";
import { startTransition, useActionState } from "react";
import clsx from "clsx";
import { postReaction } from "@/lib/actions/likes/likes.actions";
import ReactionItem from "../reaction-item";
import FriendRequestButton from "../friend-request-button";
import { useFriends } from "@/lib/context/friends.context";

type PostAuthorProps = {
    post: PostType;
    isFriendWithPostAuthor: boolean;
}

const PostAuthor = ({ post, isFriendWithPostAuthor }: PostAuthorProps) => {
    let controls;

    if (isFriendWithPostAuthor) {
        controls = null;
    } else if (post.postOwner) {
        controls = (
            <div className="grid grid-cols-2 gap-2">
                <EditPost postId={post.postId} postContent={post.body} />
                <DeletePost postId={post.postId} />
            </div>
        )
    } else {
        controls = (<FriendRequestButton receiverId={post.author.id} />)
    }

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Avatar
                    avatar={post.author.avatarUrl}
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

type PostReactionsProps = {
    postId: string;
    commentsCount: number;
    likesCount: number;
    open?: () => void;
    reaction: () => void;
    isLikedPost: boolean;
}

const PostReactions = ({ postId, commentsCount, likesCount, isLikedPost, reaction, open }: PostReactionsProps) => {
    const postReactionWithPostId = postReaction.bind(null, postId, isLikedPost);
    const [, formAction, isPending] = useActionState(postReactionWithPostId, {
        success: false,
    });

    const handleReaction = () => {
        reaction();
        startTransition(() => {
            formAction();
        })
    }

    return (
        <div className="flex gap-4">
            <button onClick={handleReaction} disabled={isPending}>
                <ReactionItem
                    icon={<Heart className={clsx('', isLikedPost && 'stroke-red-500 fill-red-700')} />}
                    count={likesCount}
                />
            </button>

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
    reaction: () => void;
    isLikedPost: boolean;
    open?: () => void;
}

export default function Post({
    post,
    open,
    isLikedPost,
    reaction
}: Readonly<PostProp>) {
    const { friends } = useFriends();
    const isFriendWithPostAuthor = friends.some(friend => friend.id === post.author.id);

    return (
        <div className="flex flex-col gap-4">
            <PostAuthor
                post={post}
                isFriendWithPostAuthor={isFriendWithPostAuthor}
            />

            <PostContent
                content={post.body}
            />

            <PostReactions
                postId={post.postId}
                commentsCount={post.commentsCount}
                likesCount={post.likesCount}
                open={open}
                reaction={reaction}
                isLikedPost={isLikedPost}
            />
        </div>
    )
}