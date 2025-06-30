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
import { deletePost } from "@/lib/utils/supabase/actions/post/post";

type DeletePostProps = {
    postId: string;
}

export default function DeletePost({ postId }: Readonly<DeletePostProps>) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-stone-600 hover:bg-stone-500 min-w-[5vw]">Delete post</Button>
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader className="border-b-1 border-stone-500 pb-4">
                    <DialogTitle className="!text-lg">Delete post</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this post?</p>

                <div className="grid grid-cols-2 gap-2">
                    <form className="w-full">
                        <Button
                            variant={'secondary'}
                            formAction={deletePost.bind(null, postId)}
                            className="w-full"
                        >
                            Delete
                        </Button>
                    </form>
                    <DialogClose asChild>
                        <Button variant={'destructive'}>Cancel</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}