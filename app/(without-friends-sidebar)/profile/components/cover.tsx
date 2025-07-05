'use client';

import { useUser } from "@/lib/context/user.context";
import Image from "next/image";

export default function Cover() {
    const { user } = useUser();

    return (
        user.coverUrl ? (
            <Image
                src={user.coverUrl}
                alt="User cover photo"
                fill
                className="object-cover object-center"
            />
        ) : (
            <div className="w-full h-full absolute inset-0 bg-surface" />
        )
    )
}