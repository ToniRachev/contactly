'use client';

import { PhotoType } from "@/lib/types/photos";
import { useEffect } from "react";
import CloseButton from "./close-button";
import Navigation from "./navigation";
import Photo from "./photo";
import { BaseUserType } from "@/lib/types/user";
import usePhotos from "../lib/hooks/usePhotos";

type GalleryProps = {
    initialPhotos: PhotoType[];
    activePhotoId: string;
    author: BaseUserType;
}

// TODO: Add photo alt

export default function Gallery({ initialPhotos, activePhotoId, author }: Readonly<GalleryProps>) {
    const { photos, galleryNavigation, togglePhotoReaction, photoComments } = usePhotos(initialPhotos, activePhotoId);

    useEffect(() => {
        window.history.replaceState(null, '', `/photos/${photos[galleryNavigation.activePhotoIndex].id}`);
    }, [galleryNavigation.activePhotoIndex, photos])

    const albumHasMoreThanOnePhoto = photos.length > 1;

    return (
        <div className="w-full flex justify-center items-center relative">
            <CloseButton />

            <Photo
                author={author}
                photo={photos[galleryNavigation.activePhotoIndex]}
                photoReaction={togglePhotoReaction}
                photoComments={photoComments}
            />

            {albumHasMoreThanOnePhoto && (
                <Navigation navigation={galleryNavigation} />
            )}
        </div>
    )
}