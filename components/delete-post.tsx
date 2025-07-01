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
import { deletePostAction } from "@/lib/utils/supabase/actions/post/post.actions";
import { useActionState, useEffect, useState } from "react";
import { usePosts } from "@/lib/context/posts";

type DeletePostProps = {
    postId: string;
}

export default function DeletePost({ postId }: Readonly<DeletePostProps>) {
    const [open, setOpen] = useState(false);

    const { deletePost } = usePosts();

    const actionWithPostId = deletePostAction.bind(null, postId)
    const [state, formAction, isPending] = useActionState(actionWithPostId, {
        success: false,
    })

    useEffect(() => {
        if (state.success) {
            deletePost(postId);
            setOpen(false);
        }
    }, [state.success, deletePost, postId])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                            formAction={formAction}
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? 'Deleting...' : 'Delete'}
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