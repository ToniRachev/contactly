'use client';

import { PhotoType } from "@/lib/types/photos";
import { useEffect, useState } from "react";
import CloseButton from "./close-button";
import Navigation from "./navigation";
import Photo from "./photo";
import { BaseUserType } from "@/lib/types/user";

type GalleryProps = {
    photos: PhotoType[];
    activePhotoId: string;
    author: BaseUserType;
}

// TODO: Add photo alt

export default function Gallery({ photos, activePhotoId, author }: Readonly<GalleryProps>) {
    const [activePhotoIndex, setActivePhotoIndex] = useState(photos.findIndex(photo => photo.id === activePhotoId));

    const activePhoto = photos[activePhotoIndex];

    const handleNextPhoto = () => {
        setActivePhotoIndex((prev) => {
            if (prev === photos.length - 1) {
                return 0;
            }

            return prev + 1;
        });
    }

    const handlePreviousPhoto = () => {
        setActivePhotoIndex((prev) => {
            if (prev === 0) {
                return photos.length - 1;
            }

            return prev - 1;
        });
    }

    useEffect(() => {
        window.history.replaceState(null, '', `/photos/${photos[activePhotoIndex].id}`);
    }, [activePhotoIndex, photos])

    return (
        <div className="w-full flex justify-center items-center relative">
            <CloseButton />

            <Photo
                url={activePhoto.url}
                author={author}
                createdAt={activePhoto.createdAt}
            />

            <Navigation
                handlePreviousPhoto={handlePreviousPhoto}
                handleNextPhoto={handleNextPhoto}
            />
        </div>
    )
}