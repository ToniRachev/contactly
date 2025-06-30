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
import { Textarea } from "./ui/textarea";

type EditPostProps = {
    postContent: string;
}

export default function EditPost({ postContent }: Readonly<EditPostProps>) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-stone-600 hover:bg-stone-500 min-w-[5vw]">Edit post</Button>
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader className="border-b-1 border-stone-500 pb-4">
                    <DialogTitle className="!text-lg">Edit post</DialogTitle>
                </DialogHeader>
                <form>
                    <Textarea
                        className="resize-none min-h-[5vw]"
                        placeholder="What’s on your mind?"
                        name="body"
                        defaultValue={postContent}
                    />

                    <div className="grid grid-cols-2 gap-2 pt-4">
                        <Button variant={'secondary'}>Save</Button>

                        <DialogClose asChild>
                            <Button variant={'destructive'}>Cancel</Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}