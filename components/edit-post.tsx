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
import { useActionState, useEffect, useState } from "react";
import { editPostAction } from "@/lib/actions/post/post.actions";
import { PostSchemaErrorType, PostSchemaType } from "@/lib/validations/postSchema";
import { usePosts } from "@/lib/context/posts.context";

type EditPostProps = {
    postId: string;
    postContent: string;
}

export default function EditPost({ postId, postContent }: Readonly<EditPostProps>) {
    const [open, setOpen] = useState(false);

    const { editPost } = usePosts();
    const editPostActionWithId = editPostAction.bind(null, postId);

    const [state, formAction, isPending] = useActionState(editPostActionWithId, {
        data: {
            body: postContent,
        } as PostSchemaType,
        errors: {} as PostSchemaErrorType,
        success: false
    })

    useEffect(() => {
        if (state.success) {
            editPost(postId, state.data.body);
            setOpen(false);
        }
    }, [state.success, postId, editPost, state.data.body])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                        defaultValue={state.data.body}
                    />

                    <div className="grid grid-cols-2 gap-2 pt-4">
                        <Button
                            variant={'secondary'}
                            formAction={formAction}
                            disabled={isPending}
                        >
                            {isPending ? 'Saving...' : 'Save'}
                        </Button>

                        <DialogClose asChild>
                            <Button variant={'destructive'}>Cancel</Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}