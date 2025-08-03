import ImagesUploadIconTrigger from "./images-upload-icon-trigger";
import { ColumnsPhotoAlbum, RenderImageContext, RenderImageProps } from "react-photo-album";
import "react-photo-album/columns.css";
import Image from "next/image";
import { Pen } from "lucide-react";
import { CustomPhoto, PostImageType, PostImagesType } from "../types";
import { Button } from "@/components/ui/button";
import RemoveImageButton from "./remove-image-button";

const MAX_IMAGES_TO_SHOW = 4;

const convertFileListToImages = (fileList: PostImageType[]) => {
    return fileList.map((file) => ({
        src: file.url,
        width: 300,
        height: 300,
        objectFit: "cover",
        isPlaceholder: false,
        file: file.file
    }));
}

const wrapImages = (images: PostImageType[], imagesLength: number | undefined) => {
    if (!images || !imagesLength) return [];
    const imagesToShow = convertFileListToImages(images);

    const isMoreThanMaxImages = imagesLength > MAX_IMAGES_TO_SHOW;

    if (isMoreThanMaxImages) {
        return [...imagesToShow.slice(0, MAX_IMAGES_TO_SHOW), {
            key: 'placeholder',
            src: '',
            width: 300,
            height: 300,
            objectFit: "cover",
            file: new File([], ''),
            isPlaceholder: true
        }];
    }

    return imagesToShow;
}

type PostImagesProps = {
    postImages: PostImagesType;
    openEditImages: () => void;
}

export default function PostImages({ postImages, openEditImages }: Readonly<PostImagesProps>) {
    const { images, handleAddImages, handleRemoveImage } = postImages;

    const renderImage = (
        { alt = "", title, sizes }: RenderImageProps,
        { photo, width, height }: RenderImageContext<CustomPhoto>
    ) => {
        if (photo?.isPlaceholder) {
            const remainingImages = Math.abs(MAX_IMAGES_TO_SHOW - images.length);

            return (
                <div className="w-full relative flex items-center justify-center backdrop-opacity-15 bg-surface" style={{ aspectRatio: `${width} / ${height}` }}>
                    <h6 className="text-white text-sm font-medium">+ {remainingImages}</h6>
                </div>
            )
        }

        return (
            <div className="w-full relative" style={{ aspectRatio: `${width} / ${height}` }}>
                <Image src={photo.src} alt={alt} title={title} sizes={sizes} fill className="object-cover" />

                <div className="absolute top-2 right-2">
                    <RemoveImageButton removeImage={handleRemoveImage} image={photo} />
                </div>
            </div>
        )
    }

    const imagesToShow = wrapImages(images, images?.length);
    const isMoreThanMaxImages = imagesToShow.length > MAX_IMAGES_TO_SHOW;

    return (
        <div className="pt-2 space-y-2 relative">
            <ColumnsPhotoAlbum
                columns={images && images.length > 1 ? 2 : 1}
                photos={imagesToShow}
                render={{ image: renderImage }}
            />
            <ImagesUploadIconTrigger onImageChange={handleAddImages} />

            {isMoreThanMaxImages && (
                <div className="absolute top-0 left-1 w-fit h-fit mt-4">
                    <Button variant='secondary' className="" type="button" onClick={openEditImages}>
                        <Pen className="" />
                        <span className="text-sm font-medium">Edit images</span>
                    </Button>
                </div>
            )}
        </div>
    )
}