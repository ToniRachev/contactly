import Image from "next/image";
import { SectionWrapper } from ".";
import { Camera } from "lucide-react";
import ImageUploadWrapper from "@/components/image-upload-wrapper";

export default function EditUserCover() {

    const handleImageChange = (file: File) => {
        console.log(file);
    }

    return (
        <SectionWrapper title="Edit cover photo" className="justify-center">
            <div className="relative w-full flex h-[25svh]">
                <ImageUploadWrapper name="cover" onImageChange={handleImageChange}>
                    <Image src={'/user_profile_background.png'} alt="User cover photo" className="object-cover" fill />
                    <div className="absolute bottom-0 right-0 bg-stone-600 p-1 rounded-full">
                        <Camera />
                    </div>
                </ImageUploadWrapper>
            </div>
        </SectionWrapper>
    )
}