'use client';

import MessageInput from "@/components/message-input";
import { addPhotoComment } from "@/lib/actions/photos/photos.actions";
import { parseAndValidateFormData } from "@/lib/utils";
import { commentSchema } from "@/lib/validations/postSchema";
import { useRef } from "react";

type PhotoCommentProps = {
    photoId: string;
    userId: string;
}

export default function PhotoComment({ photoId, userId }: Readonly<PhotoCommentProps>) {
    const formRef = useRef<HTMLFormElement>(null);

    const formAction = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== 'Enter' || e.shiftKey || !formRef.current) return;
        e.preventDefault();

        const formData = new FormData(formRef.current);

        const { data, result } = parseAndValidateFormData(formData, commentSchema, ['body']);

        if (result.success) {
            await addPhotoComment({
                photoId,
                userId,
                body: data.body as string,
            });

            formRef.current.reset();
        }
    }

    return (
        <div className="pt-4">
            <form ref={formRef}>
                <MessageInput
                    name="body"
                    placeholder="Add a comment"
                    onKeyDown={formAction}
                />
            </form>
        </div>
    )
}