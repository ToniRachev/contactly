import { PhotoType } from "@/lib/types/photos";
import Image from "next/image";
import SectionWrapper from "./section-wrapper";
import Link from "next/link";

type PhotosListProps = {
    photos: PhotoType[];
    profileId: string;
}

const List = ({ photos }: Readonly<{ photos: PhotoType[] }>) => {
    return (
        <ul className="grid grid-cols-3 gap-3">
            {photos.map((photo) => (
                <li key={photo.id}>
                    <Link href={`/photos/${photo.id}`}>
                        <Image src={photo.url} alt={photo.caption ?? ''} width={100} height={100} className="w-full h-full object-cover" />
                    </Link>
                </li>
            ))}
        </ul>
    )
}

const EmptyList = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p>No photos yet</p>
        </div>
    )
}

export default function PhotosList({ photos, profileId }: Readonly<PhotosListProps>) {
    const hasPhotos = photos.length > 0;
    const ListComponent = hasPhotos ? List : EmptyList;

    return (
        <SectionWrapper title="Photos">
            {hasPhotos && (
                <div className="absolute top-5 right-4">
                    <Link href={`/profile/${profileId}/photos`}>
                        See all photos
                    </Link>
                </div>
            )}

            <ListComponent photos={photos} />
        </SectionWrapper>
    )
}