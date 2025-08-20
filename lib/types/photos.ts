import { CommentDBType, CommentType } from "./post";
import { BaseUserDBType, BaseUserType } from "./user";

export enum AlbumTypeEnum {
    AVATAR = "avatar",
    COVER = "cover",
    TIMELINE = "timeline",
    CUSTOM = "custom",
}

export type PhotoDBType = {
    id: string;
    album_id: string;
    author_id: string;
    url: string;
    caption: string | null;
    created_at: string;
    likes: {
        userId: string;
    }[];
    comments: CommentDBType[];
    author: BaseUserDBType;
}

export type AlbumDBType = {
    id: string;
    author_id: string;
    type: AlbumTypeEnum;
    created_at: string;
    photos: PhotoDBType[];
    author: BaseUserDBType;
}

export type PhotoType = {
    id: string;
    albumId: string;
    authorId: string;
    url: string;
    caption: string | null;
    createdAt: string;
    likes: string[];
    likesCount: number;
    comments: CommentType[];
    author: BaseUserType;
}

export type AlbumType = {
    id: string;
    authorId: string;
    type: AlbumTypeEnum;
    createdAt: string;
    photos: PhotoType[];
    author: BaseUserType;
}