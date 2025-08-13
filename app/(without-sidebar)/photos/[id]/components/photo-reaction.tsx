'use client';

import { photoReaction as photoAction } from "@/lib/actions/photos/photos.actions";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { startTransition } from "react";

type PhotoReactionProps = {
    photoId: string;
    isLikedPhoto: boolean;
    likesCount: number;
    photoReaction: {
        handleOptimisticPhotoReaction: (photoId: string, isLikedPhoto: boolean, userId: string) => void;
        updateLocalPhotoReaction: (photoId: string, isLikedPhoto: boolean, userId: string) => void;
    }
}

export default function PhotoReaction({ photoId, isLikedPhoto, likesCount, photoReaction }: Readonly<PhotoReactionProps>) {
    const { user } = useAuthenticatedUser();

    const handlePhotoReaction = async () => {
        startTransition(async () => {
            photoReaction.handleOptimisticPhotoReaction(photoId, isLikedPhoto, user.id);

            const response = await photoAction({ id: photoId, userId: user.id, isLikedPhoto });

            if (response.success) {
                photoReaction.updateLocalPhotoReaction(photoId, isLikedPhoto, user.id);
            }
        })
    }

    return (
        <div className="flex items-center gap-2">
            <p>{likesCount}</p>
            <form>
                <button className="text-sm text-white" type="submit" formAction={handlePhotoReaction}>
                    {isLikedPhoto ? 'Unlike' : 'Like'}
                </button>
            </form>
        </div>
    )
}