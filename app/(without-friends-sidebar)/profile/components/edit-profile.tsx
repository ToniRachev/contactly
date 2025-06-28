import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import clsx from "clsx"
import { Calendar, Camera } from "lucide-react"
import Image from "next/image"
import { ReactNode } from "react"
import EditField, { FieldType } from "./edit-field"
import EditProfilePicture from "./edit-profile-picture"

type SectionWrapperProps = {
    title: string;
    children: ReactNode;
    className?: string;
}

const editFields: FieldType[] = [
    {
        field: 'hometown',
        data: null,
        icon: null,
        type: 'text',
    },
    {
        field: 'current city',
        data: null,
        icon: null,
        type: 'text',
    },
    {
        field: 'high school',
        data: null,
        icon: null,
        type: 'text',
    },
    {
        field: 'birth date',
        data: '1992-05-30',
        icon: <Calendar />,
        type: 'date',
    }
];

export const SectionWrapper = ({ title, children, className }: SectionWrapperProps) => {
    return (
        <div>
            <p>{title}</p>

            <div className={clsx('w-full flex py-4', className)}>
                {children}
            </div>
        </div>
    )
}

const EditCoverPhoto = () => {
    return (
        <SectionWrapper title="Edit cover photo" className="justify-center">
            <div className="relative w-full h-[25svh]">
                <Image src={'/user_profile_background.png'} alt="User cover photo" className="object-cover" fill />
                <div className="absolute bottom-0 right-0 bg-stone-600 p-1 rounded-full">
                    <Camera />
                </div>
            </div>
        </SectionWrapper>
    )
}

const EditBio = () => {
    return (
        <SectionWrapper title="Edit your bio">
            <ul className="w-full">
                {editFields.map((field) => (
                    <EditField key={field.field} field={field} />
                ))}
            </ul>
        </SectionWrapper>
    )
}

export default function EditProfile() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary'>Edit profile</Button>
            </DialogTrigger>
            <DialogContent className="border-none p-4 min-w-[40vw]">
                <DialogHeader className="border-b-1 pb-2 border-stone-700">
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[80svh] pr-4
                  [&::-webkit-scrollbar]:w-2 
                    [&::-webkit-scrollbar-track]:bg-surface
                    [&::-webkit-scrollbar-thumb]:bg-[#8C8C8C]
                    [&::-webkit-scrollbar-button]:hidden"
                >
                    <EditProfilePicture />
                    <EditCoverPhoto />
                    <EditBio />
                </div>
            </DialogContent>
        </Dialog >
    )
}