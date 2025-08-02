import { useState } from "react";
import ImagesUploadIconTrigger from "./images-upload-icon-trigger";
import { ColumnsPhotoAlbum, RenderImageContext, RenderImageProps, Photo } from "react-photo-album";
import "react-photo-album/columns.css";
import Image from "next/image";

interface CustomPhoto extends Photo {
    isPlaceholder?: boolean;
}

const MAX_IMAGES = 4;

const imageAlreadyExists = (images: FileList, newImage: File) => {
    return Array.from(images).some(
        (image) => image.name === newImage.name
            && image.size === newImage.size
            && image.type === newImage.type
            && image.lastModified === newImage.lastModified
    );
}

const convertFileListToImages = (fileList: FileList) => {
    return Array.from(fileList).map((file) => ({
        src: URL.createObjectURL(file),
        width: 300,
        height: 300,
        objectFit: "cover",
        isPlaceholder: false
    }));
}

const wrapImages = (fileList: FileList | null, imagesLength: number | undefined) => {
    if (!fileList || !imagesLength) return [];
    const images = convertFileListToImages(fileList);

    const isMoreThanMaxImages = imagesLength > MAX_IMAGES;

    if (isMoreThanMaxImages) {
        return [...images.slice(0, MAX_IMAGES), {
            key: 'placeholder',
            src: '',
            width: 300,
            height: 300,
            objectFit: "cover",
            isPlaceholder: true
        }];
    }

    return images;
}

const renderImage = (
    { alt = "", title, sizes }: RenderImageProps,
    { photo, width, height }: RenderImageContext<CustomPhoto>
) => {
    if (photo?.isPlaceholder) {
        return (
            <div className="w-full relative flex items-center justify-center backdrop-opacity-15 bg-surface" style={{ aspectRatio: `${width} / ${height}` }}>
                <h6 className="text-white text-sm font-medium">+ 7</h6>
            </div>
        )
    }
    return (
        <div className="w-full relative" style={{ aspectRatio: `${width} / ${height}` }}>
            <Image src={photo.src} alt={alt} title={title} sizes={sizes} fill className="object-cover" />
        </div>
    )
}

export default function PostImages() {
    const [images, setImages] = useState<FileList | null>(null);

    const handleAddImages = (images: FileList) => {
        if (images.length === 0) return;

        setImages((prevState) => {
            if (prevState) {
                const newImages = Array.from(images).filter((image) => !imageAlreadyExists(prevState, image));
                return [...prevState, ...newImages] as unknown as FileList;
            }
            return images;
        });
    }

    const imagesToShow = wrapImages(images, images?.length);

    return (
        <div className="pt-2 space-y-2">
            <ColumnsPhotoAlbum
                columns={images && images.length > 1 ? 2 : 1}
                photos={imagesToShow}
                render={{ image: renderImage }}
            />
            <ImagesUploadIconTrigger onImageChange={handleAddImages} />
        </div>
    )
}