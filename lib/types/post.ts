import { AlbumDBType, AlbumType } from "./photos";
import { BaseUserDBType, BaseUserType } from "./user";

export type CountType = { count: number }[];
export type LikesType = { user: string }[];

export type CommentDBType = {
    id: string;
    createdAt: string;
    authorId: string;
    author: BaseUserDBType;
    postId: string;
    body: string;
    likesCount: CountType;
    likes: LikesType;
}

export type CommentType = {
    id: string;
    createdAt: string;
    authorId: string;
    author: BaseUserType;
    postId: string;
    body: string;
    likes: string[];
    likesCount: number;
}

export type PostDBType = {
    postId: string;
    createdAt: string;
    body: string;
    author: BaseUserDBType;
    commentsCount: CountType;
    likesCount: CountType;
    likes: LikesType;
    album: AlbumDBType;
}

export type PostType = {
    postId: string;
    createdAt: string;
    author: BaseUserType;
    body: string;
    commentsCount: number;
    likesCount: number;
    likes: string[];
    postOwner: boolean;
    album: AlbumType;
}