import Image from "next/image";

type CoverProps = {
    coverUrl: string | null;
}

export default function Cover({ coverUrl }: Readonly<CoverProps>) {

    return (
        coverUrl ? (
            <Image
                src={coverUrl}
                alt="User cover photo"
                fill
                className="object-cover object-center"
            />
        ) : (
            <div className="w-full h-full absolute inset-0 bg-surface" />
        )
    )
}