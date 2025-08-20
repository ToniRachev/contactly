'use client';

import Avatar from "../user-avatar"
import { PostType } from "@/lib/types/post";
import { formatRelativeTime } from "@/lib/utils";
import DeletePost from "../delete-post";
import EditPost from "../edit-post";
import { startTransition, useActionState } from "react";
import { postReaction } from "@/lib/actions/likes/likes.actions";
import { ColumnsPhotoAlbum, Photo, RenderImageContext, RenderImageProps } from "react-photo-album";
import { AlbumType } from "@/lib/types/photos";
import Image from "next/image";
import Link from "next/link";
import Like from "../reaction/like";
import CommentReaction from "../reaction/comment-reaction";
import { useAuthenticatedUser } from "@/lib/context/user.context";

type PostAuthorProps = {
    post: PostType;
}

const PostAuthor = ({ post }: PostAuthorProps) => {
    const { user } = useAuthenticatedUser();

    const isOwnPost = post.author.id === user?.id;

    return (
        <div className="flex justify-between items-center">
            <div className="">
                <Link href={`/profile/${post.author.id}`}>
                    <div className="flex items-center gap-4">
                        <Avatar
                            avatar={post.author.avatarUrl}
                        />
                        <div>
                            <h6>{post.author.fullName}</h6>
                            <p>{formatRelativeTime(post.createdAt)}</p>
                        </div>
                    </div>
                </Link>
            </div>

            {isOwnPost && (
                <div className="grid grid-cols-2 gap-2">
                    <EditPost postId={post.postId} postContent={post.body} />
                    <DeletePost postId={post.postId} />
                </div>
            )}

        </div>
    )
}

type PostContentProps = {
    content: string;
    album: AlbumType;
}

type CustomPhoto = {
    id: string;
} & Photo;

function renderNextImage(
    { alt = "", title, sizes }: RenderImageProps,
    { photo, width, height }: RenderImageContext<CustomPhoto>
) {
    return (
        <Link href={`/photos/${photo.id}`} className="w-full h-full">
            <Image
                alt={alt}
                title={title}
                sizes={sizes}
                src={photo.src}
                width={width}
                height={height}
                style={{
                    width: width,
                    height: height,
                    objectFit: 'cover'
                }}
            />
        </Link>
    )
}

const PostContent = ({ content, album }: PostContentProps) => {
    return (
        <div className="space-y-4">
            <p>{content}</p>
            <div>
                <ColumnsPhotoAlbum
                    columns={album.photos.length > 1 ? 2 : 1}
                    photos={album.photos.map((photo) => ({
                        src: photo.url,
                        width: 100,
                        height: 100,
                        id: photo.id
                    }))}
                    render={{ image: renderNextImage }}
                />
            </div>
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
    const [, formAction] = useActionState(postReactionWithPostId, {
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
            <Like isLiked={isLikedPost} count={likesCount} like={handleReaction} />

            <CommentReaction count={commentsCount} onClick={open} />
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
    return (
        <div className="flex flex-col gap-4">
            <PostAuthor post={post} />

            <PostContent
                content={post.body}
                album={post.album}
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