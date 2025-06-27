import { Heart, LucideIcon, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import UserAvatar from "./user-avatar"

type PostAuthorProps = {
    avatar: string;
    authorName: string;
    postedAt: string;
    areFriends: boolean;
    isOwnPost: boolean;
}

const PostAuthor = ({ avatar, authorName, postedAt, areFriends, isOwnPost }: PostAuthorProps) => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <UserAvatar
                    avatar={avatar}
                    width={100}
                    height={100}
                />
                <div>
                    <h6>{authorName}</h6>
                    <p>{postedAt}</p>
                </div>
            </div>

            {!isOwnPost && (
                <div>
                    <Button className="bg-stone-600 hover:bg-stone-500 min-w-[5vw]">
                        {areFriends ? 'Friend' : 'Add friend'}
                    </Button>
                </div>
            )}
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
}


const PostReactions = ({ comments, likes }: PostReactionsProps) => {
    return (
        <div className="flex gap-4">
            <ReactionItem
                icon={Heart}
                count={likes}
            />

            <ReactionItem
                icon={MessageCircle}
                count={comments}
            />
        </div>
    )
}

type PostProps = {
    avatar: string;
    authorName: string;
    postedAt: string;
    content: string;
    likes: number;
    comments: number;
    areFriends: boolean;
}

export default function Post({
    avatar,
    authorName,
    postedAt,
    content,
    likes,
    comments,
    areFriends
}: PostProps) {
    const currentUserId = 'Traveler Jane';
    const isOwnPost = authorName === currentUserId;


    return (
        <div className="max-w-[50vw] flex flex-col gap-4">
            <PostAuthor
                avatar={avatar}
                authorName={authorName}
                postedAt={postedAt}
                areFriends={areFriends}
                isOwnPost={isOwnPost}
            />

            <PostContent
                content={content}
            />

            <PostReactions
                comments={comments}
                likes={likes}
            />
        </div>
    )
}