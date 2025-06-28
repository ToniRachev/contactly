'use client';

import { useRef } from "react";
import UserAvatar from "@/components/user-avatar";
import { SectionWrapper } from "./edit-profile";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EditProfilePicture() {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    return (
        <SectionWrapper title="Edit profile picture" className="justify-center">
            <div
                className="relative w-fit hover:opacity-80 hover:cursor-pointer"
                onClick={handleClick}
            >
                <UserAvatar
                    avatar={'/user_avatar.webp'}
                />
                <div className="absolute bottom-0 right-0 bg-stone-600 p-1 rounded-full">
                    <Camera />
                </div>

                <Input
                    ref={inputRef}
                    hidden
                    name='profilePicture'
                    type='file'
                />
            </div>
        </SectionWrapper>
    )
}