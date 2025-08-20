import { PhotoType } from "@/lib/types/photos";
import SectionWrapper from "./section-wrapper";
import Link from "next/link";
import PhotoLink from "./photo-link";

type PhotosListProps = {
    photos: PhotoType[];
    profileId: string;
}

const List = ({ photos }: Readonly<{ photos: PhotoType[] }>) => {
    return (
        <ul className="grid grid-cols-3 gap-3">
            {photos.map((photo) => (
                <li key={photo.id}>
                    <PhotoLink photo={photo} />
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