'use client';

import { useActionState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { submitPost } from "@/lib/actions/post/post.actions";
import { PostSchemaErrorType, PostSchemaType } from "@/lib/validations/postSchema";
import { usePosts } from "@/lib/context/posts.context";
import PostImages from "./post-images";


type FormProps = {
    closeDialog: () => void;
}

export default function Form({ closeDialog }: Readonly<FormProps>) {
    const path = usePathname();
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
            closeDialog();
        }
    }, [state.success, state.newPost, addPost, closeDialog])

    return (
        <div className="pt-4 relative  max-w-[24svw]">
            <form className="">
                <Textarea
                    className="resize-none h-32 whitespace-pre-wrap overflow-y-auto break-words scrollbar-custom"
                    placeholder="What’s on your mind?"
                    name="body"
                    defaultValue={state.data.body}
                />
                <PostImages />

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
    )
}