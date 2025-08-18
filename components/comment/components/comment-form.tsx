import MessageInput from "@/components/message-input";
import { parseAndValidateFormData } from "@/lib/utils";
import { commentSchema } from "@/lib/validations/postSchema";
import clsx from "clsx";
import { useRef } from "react";

type CommentFormProps = {
    onSubmitSuccess: (content: string) => void;
    className?: string;
    value?: string;
}

export default function CommentForm({ onSubmitSuccess, className, value }: Readonly<CommentFormProps>) {
    const formRef = useRef<HTMLFormElement>(null);

    const formAction = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== 'Enter' || e.shiftKey || !formRef.current) return;
        e.preventDefault();

        const formData = new FormData(formRef.current);

        const { data, result } = parseAndValidateFormData(formData, commentSchema, ['body']);

        if (result.success) {
            onSubmitSuccess(data.body as string);
            formRef.current.reset();
        }
    }

    return (
        <div className={clsx('w-full', className)}>
            <form ref={formRef}>
                <MessageInput
                    name="body"
                    placeholder="Add a comment"
                    onKeyDown={formAction}
                    value={value}
                />
            </form>
        </div>
    )
}
