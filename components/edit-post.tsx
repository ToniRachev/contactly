'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { DialogClose } from "@radix-ui/react-dialog";

export default function EditPost() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-stone-600 hover:bg-stone-500 min-w-[5vw]">Edit post</Button>
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader className="border-b-1 border-stone-500 pb-4">
                    <DialogTitle className="!text-lg">Edit post</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2">
                    <DialogClose asChild>
                        <Button variant={'destructive'}>Cancel</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}