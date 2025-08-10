import Avatar from "@/components/user-avatar";
import { AlbumAuthorType } from "@/lib/types/photos";
import { formatFullName, formatRelativeTime } from "@/lib/utils";

type PhotoMetadataProps = {
    author: AlbumAuthorType;
    createdAt: string;
}

export default function PhotoMetadata({ author, createdAt }: Readonly<PhotoMetadataProps>) {
    return (
        <div className="pt-12 pl-8">
            <div className="flex items-center gap-2">
                <Avatar avatar={author.avatarUrl} size={'sm'} />
                <div>
                    <p className="text-sm text-white">{formatFullName(author.firstName, author.lastName)}</p>
                    <p className="text-sm text-white">{formatRelativeTime(createdAt)}</p>
                </div>
            </div>
        </div>
    )
}