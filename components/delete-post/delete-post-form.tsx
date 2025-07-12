'use client';

import { usePosts } from "@/lib/context/posts.context";
import { Button } from "../ui/button";
import { deletePostAction } from "@/lib/actions/post/post.actions";
import { useActionState, useEffect } from "react";
import ErrorMessage from "../error-message";

type DeletePostFormProps = {
    postId: string;
    setOpen: (open: boolean) => void;
}

export default function DeletePostForm({ postId, setOpen }: Readonly<DeletePostFormProps>) {
    const { deletePost } = usePosts();

    const actionWithPostId = deletePostAction.bind(null, postId)
    const [state, formAction, isPending] = useActionState(actionWithPostId, {
        success: false,
        error: null
    })

    useEffect(() => {
        if (state.success) {
            deletePost(postId);
            setOpen(false);
        }
    }, [state.success, deletePost, postId, setOpen])

    return (
        <form className="w-full relative">
            <Button
                variant={'secondary'}
                formAction={formAction}
                className="w-full"
                disabled={isPending}
            >
                {isPending ? 'Deleting...' : 'Delete'}
            </Button>

            {state.error && <ErrorMessage className='pt-2 w-[20vw]'>{state.error}</ErrorMessage>}
        </form>
    )
}