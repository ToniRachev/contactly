'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UserAvatar from "./user-avatar"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useActionState, useEffect, useState } from "react";
import { submitPost } from "@/lib/utils/supabase/actions/post/post.actions";
import { PostSchemaErrorType, PostSchemaType } from "@/lib/utils/supabase/validations/postSchema";
import { usePosts } from "@/lib/context/posts";

export default function CreatePost() {
    const [open, setOpen] = useState(false);

    const { addPost } = usePosts();

    const [state, formAction, isPending] = useActionState(submitPost, {
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
                    <UserAvatar
                        avatar="/user_avatar.webp"
                        width={48}
                        height={48}
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
                        <UserAvatar
                            avatar="/user_avatar.webp"
                            width={48}
                            height={48}
                        />

                        <p>Traveler Jane</p>
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