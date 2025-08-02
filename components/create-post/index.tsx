'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import Trigger from "./trigger";
import Form from "./form";
import UserHeader from "./user-header";

export default function CreatePost() {
    const [open, setOpen] = useState(false);
    const { user } = useAuthenticatedUser();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full max-w-[50svw]">
                <Trigger avatarUrl={user.avatarUrl} />
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader className="border-b-1 border-stone-500 pb-4">
                    <DialogTitle className="!text-lg">Create post</DialogTitle>
                </DialogHeader>

                <div>
                    <UserHeader
                        avatarUrl={user.avatarUrl}
                        fullName={user.fullName}
                    />

                    <Form closeDialog={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    )
}