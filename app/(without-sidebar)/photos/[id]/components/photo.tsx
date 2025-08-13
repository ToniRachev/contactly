'use client';

import { BaseUserType } from "@/lib/types/user";
import { PhotoType } from "@/lib/types/photos";
import Image from "next/image";
import PhotoMetadata from "./photo-metadata";
import { useAuthenticatedUser } from "@/lib/context/user.context";

type PhotoProps = {
    author: BaseUserType;
    photo: PhotoType;
    photoReaction: {
        handleOptimisticPhotoReaction: (photoId: string, isLikedPhoto: boolean, userId: string) => void;
        updateLocalPhotoReaction: (photoId: string, isLikedPhoto: boolean, userId: string) => void;
    }
}

export default function Photo({ photo, author, photoReaction }: Readonly<PhotoProps>) {
    const { user } = useAuthenticatedUser();

    const isLikedPhoto = photo.likes.includes(user.id);
    return (
        <div className="">
            <Image
                src={photo.url}
                alt="Add Alt later"
                width={750}
                height={500}
                className="h-[100svh] object-cover"
            />

            <PhotoMetadata
                author={author}
                photoData={{
                    createdAt: photo.createdAt,
                    caption: photo.caption,
                    photoId: photo.id,
                    isLikedPhoto,
                    likesCount: photo.likes.length,
                }}
                photoReaction={photoReaction}
            />
        </div>
    )
}