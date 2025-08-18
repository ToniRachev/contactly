'use client';

import { useAuthenticatedUser } from "@/lib/context/user.context";
import { PhotoReactionType } from "../lib/types";

type PhotoReactionProps = {
    photoId: string;
    isLikedPhoto: boolean;
    likesCount: number;
    photoReaction: PhotoReactionType;
}

export default function PhotoReaction({ photoId, isLikedPhoto, likesCount, photoReaction }: Readonly<PhotoReactionProps>) {
    const { user } = useAuthenticatedUser();

    const handlePhotoReaction = () => {
        photoReaction(photoId, isLikedPhoto, user.id);
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