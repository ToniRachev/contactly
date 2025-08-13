'use client';

import { CustomPhoto, PostImageType } from "../types";
import Image from "next/image";
import RemoveImageButton from "./remove-image-button";
import { Input } from "@/components/ui/input";

type EditImagesProps = {
    images: PostImageType[];
    removeImage: (image: CustomPhoto | PostImageType) => void;
    addImageCaption: (imageId: string, caption: string) => void;
}

export default function EditImages({ images, removeImage, addImageCaption }: Readonly<EditImagesProps>) {
    return (
        <div className="grid grid-cols-3 gap-4 w-[50svw]">
            {images.map((image) => (
                <div key={image.id} className="w-[15vw] h-[35vh] flex flex-col gap-2">
                    <div className="relative w-full h-full">
                        <Image src={image.url} alt={image.file.name} fill className="object-cover w-full h-full" />
                        <div className="absolute top-2 right-1">
                            <RemoveImageButton removeImage={removeImage} image={image} />
                        </div>
                    </div>
                    <div className="">
                        <Input
                            name={`caption-${image.id}`}
                            type="text"
                            placeholder="Add caption"
                            defaultValue={image.caption ?? ''}
                            onChange={(e) => addImageCaption(image.id, e.target.value)}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}