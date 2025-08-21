'use client';

import { Button } from "@/components/ui/button";
import Avatar from "@/components/user-avatar";
import { BaseUserType } from "@/lib/types/user";
import { formatFullName, formatRelativeTime } from "@/lib/utils";
import { useState } from "react";
import EditPhotoDescription from "./edit-photo-description";
import { EditPhotoDescriptionType } from "../lib/types";

type PhotoMetadataProps = {
    author: BaseUserType;
    photoData: {
        createdAt: string;
        caption: string | null;
    }
    isOwnPhoto: boolean;
    editPhotoDescription: EditPhotoDescriptionType;
    photoId: string;
}

export default function PhotoMetadata({ author, photoData, isOwnPhoto, editPhotoDescription, photoId }: Readonly<PhotoMetadataProps>) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="">
            <div className="flex items-center gap-2">
                <Avatar avatar={author.avatarUrl} size={'sm'} />
                <div>
                    <p className="text-sm text-white">{formatFullName(author.firstName, author.lastName)}</p>
                    <p className="text-sm text-white">{formatRelativeTime(photoData.createdAt)}</p>
                </div>
            </div>

            <div className="py-4">
                {!isEditing && (
                    <p className="text-sm text-white">{photoData.caption}</p>
                )}

                {isOwnPhoto && !isEditing && (
                    <div className="pt-4">
                        <Button
                            variant={'secondary'}
                            className="text-sm w-fit"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                    </div>
                )}

                {isOwnPhoto && isEditing && <EditPhotoDescription value={photoData.caption ?? ''} closeEditing={() => setIsEditing(false)} editPhotoDescription={editPhotoDescription} photoId={photoId} />}
            </div>
        </div>
    )
}