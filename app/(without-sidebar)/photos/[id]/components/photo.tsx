'use client';

import { BaseUserType } from "@/lib/types/user";
import { PhotoType } from "@/lib/types/photos";
import Image from "next/image";
import PhotoMetadata from "./photo-metadata";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import PhotoComments from "./photo-comments";
import { EditPhotoDescriptionType, PhotoCommentsType, PhotoReactionType } from "../lib/types";
import TextForm from "@/components/text-form";
import PhotoEngagementStats from "./photo-engagement-stats";

type PhotoProps = {
    author: BaseUserType;
    photo: PhotoType;
    photoReaction: PhotoReactionType;
    photoComments: PhotoCommentsType;
    editPhotoDescription: EditPhotoDescriptionType;
}

export default function Photo({ photo, author, photoReaction, photoComments, editPhotoDescription }: Readonly<PhotoProps>) {
    const { user } = useAuthenticatedUser();

    const isLikedPhoto = photo.likes.includes(user.id);
    const isOwnPhoto = author.id === user.id;

    return (
        <div className="">
            <Image
                src={photo.url}
                alt="Add Alt later"
                width={750}
                height={500}
                className="h-[100svh] object-cover"
            />

            <div className="absolute top-4 left-[72%] w-full max-w-[20svw] z-[50]">
                <PhotoMetadata
                    author={author}
                    photoData={{
                        createdAt: photo.createdAt,
                        caption: photo.caption,
                    }}
                    isOwnPhoto={isOwnPhoto}
                    editPhotoDescription={editPhotoDescription}
                    photoId={photo.id}
                />

                <PhotoEngagementStats
                    photoId={photo.id}
                    likes={{
                        isLiked: isLikedPhoto,
                        count: photo.likes.length,
                        reaction: photoReaction
                    }}
                    comments={{
                        count: photo.comments.length
                    }}
                />
                <PhotoComments
                    comments={photo.comments}
                    editPhotoComment={photoComments.edit}
                    deletePhotoComment={photoComments.delete}
                    reactionPhotoComment={photoComments.reaction}
                />

                <TextForm
                    onSubmit={(content) => photoComments.add(photo.id, content, user)}
                    name="body"
                    placeholder="Add a comment"
                />
            </div>
        </div>
    )
}