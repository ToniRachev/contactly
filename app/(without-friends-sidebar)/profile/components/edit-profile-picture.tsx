import UserAvatar from "@/components/user-avatar";
import { SectionWrapper } from "./edit-profile";
import { Camera } from "lucide-react";
import ImageUploadWrapper from "@/components/image-upload-wrapper";

export default function EditProfilePicture() {

    return (
        <SectionWrapper title="Edit profile picture" className="justify-center">
            <div className="">
                <ImageUploadWrapper>
                    <div className="relative">
                        <UserAvatar
                            avatar={'/user_avatar.webp'}
                        />
                        <div className="absolute bottom-0 right-0 bg-stone-600 p-1 rounded-full">
                            <Camera />
                        </div>
                    </div>
                </ImageUploadWrapper>
            </div>
        </SectionWrapper>
    )
}