'use client';

import { PhotoType } from "@/lib/types/photos";
import { startTransition, useOptimistic, useState } from "react";

const updateState = (state: PhotoType[], photoId: string, isLikedPhoto: boolean, userId: string) => {
    return state.map(photo => {
        if (photo.id === photoId) {
            const updatedLikes = !isLikedPhoto
                ? [...photo.likes, userId]
                : photo.likes.filter(id => id !== userId);

            return { ...photo, likes: updatedLikes };
        }
        return photo;
    });
}

export default function usePhotos(initialPhotos: PhotoType[], activePhotoId: string) {
    const [photosState, setPhotosState] = useState(initialPhotos);
    const [optimisticPhotos, updateOptimisticPhotos] = useOptimistic(photosState);

    const [activePhotoIndex, setActivePhotoIndex] = useState(optimisticPhotos.findIndex(photo => photo.id === activePhotoId));

    const activePhoto = optimisticPhotos[activePhotoIndex];

    const handleNextPhoto = () => {
        setActivePhotoIndex((prev) => {
            if (prev === optimisticPhotos.length - 1) {
                return 0;
            }

            return prev + 1;
        });
    }

    const handlePreviousPhoto = () => {
        setActivePhotoIndex((prev) => {
            if (prev === 0) {
                return optimisticPhotos.length - 1;
            }

            return prev - 1;
        });
    }

    const handleOptimisticPhotoReaction = (photoId: string, isLikedPhoto: boolean, userId: string) => {
        updateOptimisticPhotos((state) => updateState(state, photoId, isLikedPhoto, userId));
    }

    const updateLocalPhotoReaction = (photoId: string, isLikedPhoto: boolean, userId: string) => {
        startTransition(() => {
            setPhotosState((state) => updateState(state, photoId, isLikedPhoto, userId));
        })
    }

    return {
        photos: optimisticPhotos,
        galleryNavigation: {
            handleNextPhoto,
            handlePreviousPhoto,
            activePhoto,
            activePhotoIndex,
            setActivePhotoIndex,
        },
        photoReaction: {
            handleOptimisticPhotoReaction,
            updateLocalPhotoReaction,
        }
    }
}