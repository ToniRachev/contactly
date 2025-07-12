import { ReactNode } from "react";
import Image from "next/image";

type CardWrapperProps = {
    avatar: string | null;
    name: string;
    children: ReactNode
}

export default function CardWrapper({ avatar, name, children }: Readonly<CardWrapperProps>) {
    const avatarUrl = avatar ?? '/user_placeholder.png';

    return (
        <li className="rounded-md border border-stone-600 overflow-hidden">
            <div>
                <Image src={avatarUrl} alt='Friend avatar' width={350} height={350} className="rounded-t-md" />
            </div>

            <div className="py-4 px-2">
                <h6>{name}</h6>

                <div className="pt-4 grid grid-cols-2">
                    {children}
                </div>
            </div>
        </li>
    )
}