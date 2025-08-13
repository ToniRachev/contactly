'use client';

import { startTransition, useActionState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { submitPost } from "@/lib/actions/post/post.actions";
import { PostSchemaErrorType, PostSchemaType } from "@/lib/validations/postSchema";
import { usePosts } from "@/lib/context/posts.context";
import { PostImagesType } from "../types";
import ErrorMessage from "@/components/error-message";
import PostImages from "./post-images";

type FormProps = {
    closeDialog: () => void;
    postImages: PostImagesType;
    openEditImages: () => void;
}

export default function Form({ closeDialog, postImages, openEditImages }: Readonly<FormProps>) {
    const formRef = useRef<HTMLFormElement>(null);

    const path = usePathname();
    const { addPost } = usePosts();

    const submitPostWithPath = submitPost.bind(null, path);
    const [state, formAction, isPending] = useActionState(submitPostWithPath, {
        data: {
            body: '',
            images: undefined,
        } as PostSchemaType,
        errors: {} as PostSchemaErrorType,
        success: false,
        newPost: null
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);

        formData.delete('images');
        formData.delete('captions');

        for (const image of postImages.images) {
            formData.append('images', image.file);
            formData.append('captions', image.caption ?? '');
        }

        startTransition(() => {
            formAction(formData);
        })
    }

    useEffect(() => {
        if (state.success && state.newPost) {
            addPost(state.newPost);
            closeDialog();
        }
    }, [state.success, state.newPost, addPost, closeDialog])

    const error = state.errors?.fieldErrors?.body?.[0] ?? state.errors?.formErrors?.[0] ?? null;

    return (
        <div className="pt-4 relative">
            <form ref={formRef} onSubmit={handleSubmit}>
                <Textarea
                    className="resize-none h-32 whitespace-pre-wrap overflow-y-auto break-words scrollbar-custom"
                    placeholder="What’s on your mind?"
                    name="body"
                    defaultValue={state.data.body}
                />
                <PostImages postImages={postImages} openEditImages={openEditImages} />

                {error && <ErrorMessage className="">{error}</ErrorMessage>}

                <div className="pt-4">
                    <Button
                        className="w-full"
                        variant={'secondary'}
                        disabled={isPending}
                    >
                        {isPending ? 'Creating post...' : 'Create post'}
                    </Button>
                </div>
            </form>
        </div>
    )
}