'use client';

import { useEffect, useState } from "react";
import { CustomPhoto, PostImageType } from "../types";

const imageAlreadyExists = (images: PostImageType[], newImage: PostImageType) => {
    return findImageIndex(images, newImage) !== -1;
}

const findImageIndex = (images: PostImageType[], newImage: { file: File }) => {
    return images.findIndex(
        (image) => image.file.name === newImage.file.name
            && image.file.size === newImage.file.size
            && image.file.type === newImage.file.type
            && image.file.lastModified === newImage.file.lastModified
    );
}

export default function useCreatePost() {
    const [open, setOpen] = useState(false);
    const [postImages, setPostImages] = useState<PostImageType[]>([]);
    const [isEditingImages, setIsEditingImages] = useState(false);

    const handleAddImages = (files: File[]) => {
        if (files.length === 0) return;

        const images = files.map((file) => ({
            file: file,
            url: URL.createObjectURL(file),
            id: crypto.randomUUID(),
            caption: null
        }))

        setPostImages((prevState) => {
            const updatedImages = prevState.filter((image) => !imageAlreadyExists(images, image))
            return [...updatedImages, ...images]
        })
    }

    const handleRemoveImage = (prop: CustomPhoto | PostImageType) => {
        const imageIndex = findImageIndex(postImages, prop);

        if (imageIndex !== -1) {
            setPostImages((prevState) => {
                const updatedImages = [...prevState];
                updatedImages.splice(imageIndex, 1);
                return updatedImages;
            })
        }
    }

    const handleAddImageCaption = (imageId: string, caption: string) => {
        setPostImages((prevState) => {
            const updatedImages = [...prevState];
            const imageIndex = updatedImages.findIndex((image) => image.id === imageId);
            if (imageIndex !== -1) {
                updatedImages[imageIndex].caption = caption;
            }
            return updatedImages;
        })
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
    }

    const openDialog = () => {
        setOpen(true);
    }

    const closeDialog = () => {
        setOpen(false);
    }

    useEffect(() => {
        return () => {
            setIsEditingImages(false);
            setPostImages([]);
        }
    }, [open])

    useEffect(() => {
        if (postImages.length <= 0 && isEditingImages) {
            setIsEditingImages(false);
        }
    }, [isEditingImages, postImages])

    return {
        dialog: {
            open,
            handleOpenChange,
            openDialog,
            closeDialog,
            isEditingImages,
            setIsEditingImages: (isEditing: boolean) => setIsEditingImages(isEditing),
        },
        postImages: {
            images: postImages,
            handleAddImages,
            handleRemoveImage,
            handleAddImageCaption
        }
    }
}