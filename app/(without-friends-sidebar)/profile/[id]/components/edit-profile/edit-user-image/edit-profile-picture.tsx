'use client';

import Avatar from "@/components/user-avatar";
import { SectionWrapper } from "..";
import { Camera } from "lucide-react";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { useCallback, useState } from "react";
import EditUserImage from "@/app/(without-friends-sidebar)/profile/[id]/components/edit-profile/edit-user-image";
import LoadingOverlay from "./loading-overlay";

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
                    {({ isPending }) => (
                        <div className="relative">
                            <Avatar
                                avatar={image}
                                size={'lg'}
                            />
                            <div className="absolute bottom-0 right-0 bg-stone-600 p-1 rounded-full">
                                <Camera />
                            </div>

                            {isPending && <LoadingOverlay className="rounded-full" />}
                        </div>
                    )}
                </EditUserImage>
            </div>
        </SectionWrapper>
    )
}