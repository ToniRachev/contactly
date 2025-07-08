'use client';

import Image from "next/image";
import { SectionWrapper } from "..";
import { Camera } from "lucide-react";
import EditUserImage from "@/app/(without-friends-sidebar)/profile/components/edit-profile/edit-user-image";
import { useUser } from "@/lib/context/user.context";
import { useCallback, useState } from "react";

export default function EditUserCover() {
    const { user, updateUserCover } = useUser();
    const [image, setImage] = useState<string | null>(user.coverUrl);

    const handleImageChange = (imageUrl: string) => {
        setImage(imageUrl);
    }

    const handleImageSuccess = useCallback((imageUrl: string) => {
        updateUserCover(imageUrl);
    }, [updateUserCover])

    return (
        <SectionWrapper title="Edit cover photo" className="justify-center">
            <EditUserImage
                imageType="cover"
                onImageChange={handleImageChange}
                onSuccess={handleImageSuccess}
            >
                <div className="relative w-full max-w-[100vw] flex h-[25svh]">

                    {image ? (
                        <Image src={image} alt="User cover photo" className="object-cover" fill />
                    ) : (
                        <div className="w-full h-full absolute inset-0 bg-surface" />
                    )}

                    <div className="absolute bottom-0 right-0 bg-stone-600 p-1 rounded-full">
                        <Camera />
                    </div>
                </div>
            </EditUserImage>
        </SectionWrapper>
    )
}