'use client';

import Avatar from "@/components/user-avatar";
import { SectionWrapper } from "..";
import { Camera } from "lucide-react";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { useCallback, useState } from "react";
import EditUserImage from "@/app/(without-friends-sidebar)/profile/components/edit-profile/edit-user-image";

export default function EditProfilePicture() {
    const { user } = useAuthenticatedUser();
    const [image, setImage] = useState<string | null>(user.avatarUrl);

    const { updateUserAvatar } = useAuthenticatedUser();

    const handleImageChange = (imageUrl: string) => {
        setImage(imageUrl);
    }

    const handleImageSuccess = useCallback((imageUrl: string) => {
        updateUserAvatar(imageUrl);
    }, [updateUserAvatar])

    return (
        <SectionWrapper title="Edit profile picture" className="justify-center">
            <div className="">
                <EditUserImage
                    imageType="avatar"
                    onImageChange={handleImageChange}
                    onSuccess={handleImageSuccess}
                >
                    <div className="relative">
                        <Avatar
                            avatar={image}
                            size={'lg'}
                        />
                        <div className="absolute bottom-0 right-0 bg-stone-600 p-1 rounded-full">
                            <Camera />
                        </div>
                    </div>
                </EditUserImage>
            </div>
        </SectionWrapper>
    )
}