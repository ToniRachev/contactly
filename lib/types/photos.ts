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
    created_at: Date;
}

export type AlbumDBType = {
    id: string;
    author_id: string;
    type: AlbumTypeEnum;
    created_at: Date;
    photos: PhotoDBType[];
}

export type PhotoType = {
    id: string;
    albumId: string;
    authorId: string;
    url: string;
    caption: string | null;
    createdAt: Date;
}

export type AlbumType = {
    id: string;
    authorId: string;
    type: AlbumTypeEnum;
    createdAt: Date;
    photos: PhotoType[];
}

