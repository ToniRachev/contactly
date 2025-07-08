import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import clsx from "clsx"
import { ReactNode } from "react"
import EditProfilePicture from "./edit-user-image/edit-profile-picture"
import EditUserCover from "./edit-user-image/edit-user-cover"
import EditBio from "./edit-bio"

type SectionWrapperProps = {
    title: string;
    children: ReactNode;
    className?: string;
}

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
                    <EditUserCover />
                    <EditBio />
                </div>
            </DialogContent>
        </Dialog >
    )
}