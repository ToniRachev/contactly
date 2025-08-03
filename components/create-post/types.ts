import { Photo } from "react-photo-album";

export interface CustomPhoto extends Photo {
    isPlaceholder?: boolean;
    file: File;
}

export type PostImageType = {
    file: File;
    url: string;
}

export type PostImagesType = {
    images: PostImageType[];
    handleAddImages: (files: File[]) => void;
    handleRemoveImage: (prop: CustomPhoto | PostImageType) => void;
}