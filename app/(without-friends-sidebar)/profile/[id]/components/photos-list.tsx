import { PhotoType } from "@/lib/types/photos";
import Image from "next/image";
import SectionWrapper from "./section-wrapper";

type PhotosListProps = {
    photos: PhotoType[];
}

export default function PhotosList({ photos }: Readonly<PhotosListProps>) {
    return (
        <SectionWrapper title="Photos">
            <ul className="grid grid-cols-3 gap-3">
                {photos.map((photo) => (
                    <li key={photo.id}>
                        <Image src={photo.url} alt={photo.caption ?? ''} width={100} height={100} className="w-full h-full object-cover" />
                    </li>
                ))}
            </ul>
        </SectionWrapper>
    )
}