import Link from "next/link";
import Image from "next/image";
import { PhotoType } from "@/lib/types/photos";

type PhotoLinkProps = {
    photo: PhotoType;
}

export default function PhotoLink({ photo }: Readonly<PhotoLinkProps>) {
    return (
        <Link href={`/photos/${photo.id}`}>
            <Image src={photo.url} alt={photo.caption ?? ''} width={500} height={500} className="w-full h-full object-cover" />
        </Link>
    )
}