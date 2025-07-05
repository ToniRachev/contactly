'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Avatar from "./user-avatar"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useActionState, useEffect, useState } from "react";
import { submitPost } from "@/lib/actions/post/post.actions";
import { PostSchemaErrorType, PostSchemaType } from "@/lib/validations/postSchema";
import { usePosts } from "@/lib/context/posts.context";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/context/user.context";

export default function CreatePost() {
    const [open, setOpen] = useState(false);

    const path = usePathname();
    const { user } = useUser();

    const { addPost } = usePosts();

    const submitPostWithPath = submitPost.bind(null, path);
    const [state, formAction, isPending] = useActionState(submitPostWithPath, {
        data: {
            body: '',
        } as PostSchemaType,
        errors: {} as PostSchemaErrorType,
        success: false,
        newPost: null
    })

    useEffect(() => {
        if (state.success && state.newPost) {
            addPost(state.newPost);
            setOpen(false);
        }
    }, [state.success, state.newPost, addPost])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full max-w-[50svw]">
                <div className="flex items-center gap-4">
                    <Avatar
                        avatar={user.avatarUrl}
                        size={'sm'}
                    />

                    <div className="bg-surface w-full p-4 text-left rounded-lg">
                        <p>Share something with your friends...</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader className="border-b-1 border-stone-500 pb-4">
                    <DialogTitle className="!text-lg">Create post</DialogTitle>
                </DialogHeader>

                <div>
                    <div className="flex items-center gap-2">
                        <Avatar
                            avatar={user.avatarUrl}
                            size={'sm'}
                        />

                        <p>{user.fullName}</p>
                    </div>

                    <div className="pt-4">
                        <form>
                            <Textarea
                                className="resize-none min-h-[5vw]"
                                placeholder="What’s on your mind?"
                                name="body"
                                defaultValue={state.data.body}
                            />

                            <div className="pt-4">
                                <Button
                                    className="w-full"
                                    variant={'secondary'}
                                    formAction={formAction}
                                    disabled={isPending}
                                >
                                    {isPending ? 'Creating post...' : 'Create post'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}