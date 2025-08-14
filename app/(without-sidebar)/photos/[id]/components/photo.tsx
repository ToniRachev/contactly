'use client';

import { BaseUserType } from "@/lib/types/user";
import { PhotoType } from "@/lib/types/photos";
import Image from "next/image";
import PhotoMetadata from "./photo-metadata";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import PhotoReaction from "./photo-reaction";
import PhotoComment from "./photo-comment";

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

            <div className="absolute top-4 left-[72%] max-w-[20svw]">
                <PhotoMetadata
                    author={author}
                    photoData={{
                        createdAt: photo.createdAt,
                        caption: photo.caption,
                    }}
                />

                <PhotoReaction
                    photoId={photo.id}
                    isLikedPhoto={isLikedPhoto}
                    likesCount={photo.likes.length}
                    photoReaction={photoReaction}
                />

                <PhotoComment
                    photoId={photo.id}
                    userId={user.id}
                />
            </div>
        </div>
    )
}