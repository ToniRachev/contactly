'use client';

import Avatar from "@/components/user-avatar";
import { BaseUserType } from "@/lib/types/user";
import { formatFullName, formatRelativeTime } from "@/lib/utils";

type PhotoMetadataProps = {
    author: BaseUserType;
    photoData: {
        createdAt: string;
        caption: string | null;
    }
}

export default function PhotoMetadata({ author, photoData }: Readonly<PhotoMetadataProps>) {
    console.log(photoData)
    return (
        <div className="">
            <div className="flex items-center gap-2">
                <Avatar avatar={author.avatarUrl} size={'sm'} />
                <div>
                    <p className="text-sm text-white">{formatFullName(author.firstName, author.lastName)}</p>
                    <p className="text-sm text-white">{formatRelativeTime(photoData.createdAt)}</p>
                </div>
            </div>

            <div className="py-2">
                <p className="text-sm text-white">{photoData.caption}</p>
            </div>


        </div>
    )
}