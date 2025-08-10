import { BaseUserType } from "@/lib/types/user";
import Image from "next/image";
import PhotoMetadata from "./photo-metadata";

type PhotoProps = {
    url: string;
    author: BaseUserType;
    createdAt: string;
}

export default function Photo({ url, author, createdAt }: Readonly<PhotoProps>) {
    return (
        <div className="flex gap-4">
            <Image
                src={url}
                alt="Add Alt later"
                width={500}
                height={500}
                className="h-[100svh] w-[40svw] object-cover"
            />

            <PhotoMetadata
                author={author}
                createdAt={createdAt}
            />
        </div>
    )
}