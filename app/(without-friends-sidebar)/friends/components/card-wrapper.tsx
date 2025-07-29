import { ReactNode } from "react";
import Image from "next/image";
import { resolveAvatarUrl } from "@/lib/utils";

type CardWrapperProps = {
    avatar: string | null;
    name: string;
    children: ReactNode
}

export default function CardWrapper({ avatar, name, children }: Readonly<CardWrapperProps>) {
    return (
        <li className="rounded-md border border-stone-600 overflow-hidden">
            <div>
                <Image src={resolveAvatarUrl(avatar)} alt='Friend avatar' width={350} height={350} className="rounded-t-md bg-stone-100 h-[38vh] object-cover" />
            </div>

            <div className="py-4 px-2">
                <h6>{name}</h6>

                <div className="pt-4 grid grid-cols-2 gap-2">
                    {children}
                </div>
            </div>
        </li>
    )
}