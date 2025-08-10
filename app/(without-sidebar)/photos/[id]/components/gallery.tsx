'use client';

import { PhotoType } from "@/lib/types/photos";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";



type GalleryProps = {
    photos: PhotoType[];
    activePhotoId: string;
}

type NavigationButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
}


const NavigationButton = ({ children, onClick }: Readonly<NavigationButtonProps>) => {
    return (
        <button
            onClick={onClick}
            className="p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 cursor-pointer z-50"
        >
            {children}
        </button>
    )
}

const CloseButton = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="absolute top-4 left-6 p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 cursor-pointer z-50"
        >
            <X />
        </button>
    )
}

// TODO: Add photo alt

export default function Gallery({ photos, activePhotoId }: Readonly<GalleryProps>) {
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

            <Image
                src={activePhoto.url}
                alt="Add Alt later"
                width={500}
                height={500}
                className="h-[100svh] w-[40svw] object-cover"
            />

            <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-6">
                <NavigationButton onClick={handlePreviousPhoto}>
                    <ChevronLeft />
                </NavigationButton>

                <NavigationButton onClick={handleNextPhoto}>
                    <ChevronRight />
                </NavigationButton>
            </div>
        </div>
    )
}