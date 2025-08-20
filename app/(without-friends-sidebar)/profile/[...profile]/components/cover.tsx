import Image from "next/image";

type CoverProps = {
    coverUrl: string | null;
}

export default function Cover({ coverUrl }: Readonly<CoverProps>) {

    return (
        <div className="h-[50svh] relative">
            {coverUrl ? (
                <Image
                    src={coverUrl}
                    alt="User cover photo"
                    fill
                    className="object-cover object-center"
                />
            ) : (
                <div className="w-full h-[50svh] absolute inset-0 bg-surface" />
            )}
        </div>
    )
}