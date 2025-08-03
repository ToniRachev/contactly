'use client';

import { CustomPhoto, PostImageType } from "../types";
import Image from "next/image";
import RemoveImageButton from "./remove-image-button";

type EditImagesProps = {
    images: PostImageType[];
    removeImage: (image: CustomPhoto | PostImageType) => void;
}

export default function EditImages({ images, removeImage }: Readonly<EditImagesProps>) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
                <div key={image.file.name} className="relative w-full h-[20vh]">
                    <Image src={image.url} alt={image.file.name} fill className="object-cover w-full h-full" />
                    <div className="absolute top-2 right-1">
                        <RemoveImageButton removeImage={removeImage} image={image} />
                    </div>
                </div>
            ))}
        </div>
    )
}