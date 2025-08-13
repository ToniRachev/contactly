'use client';

import Avatar from "@/components/user-avatar";
import { BaseUserType } from "@/lib/types/user";
import { formatFullName, formatRelativeTime } from "@/lib/utils";
import PhotoReaction from "./photo-reaction";

type PhotoMetadataProps = {
    author: BaseUserType;
    photoData: {
        createdAt: string;
        caption: string | null;
        photoId: string
        isLikedPhoto: boolean;
        likesCount: number;
    }
    photoReaction: {
        handleOptimisticPhotoReaction: (photoId: string, isLikedPhoto: boolean, userId: string) => void;
        updateLocalPhotoReaction: (photoId: string, isLikedPhoto: boolean, userId: string) => void;
    }
}

export default function PhotoMetadata({ author, photoData, photoReaction }: Readonly<PhotoMetadataProps>) {
    return (
        <div className="absolute top-4 left-[72%] max-w-[20svw]">
            <div className="flex items-center gap-2">
                <Avatar avatar={author.avatarUrl} size={'sm'} />
                <div>
                    <p className="text-sm text-white">{formatFullName(author.firstName, author.lastName)}</p>
                    <p className="text-sm text-white">{formatRelativeTime(photoData.createdAt)}</p>
                </div>
            </div>

            <div className="py-2">
                <p className="text-sm text-white">{photoData.caption}</p>
            </div>

            <PhotoReaction
                photoId={photoData.photoId}
                isLikedPhoto={photoData.isLikedPhoto}
                likesCount={photoData.likesCount}
                photoReaction={photoReaction}
            />
        </div>
    )
}