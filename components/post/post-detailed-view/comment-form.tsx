import MessageInput from "@/components/message-input";

type CommentFormProps = {
    formRef: React.RefObject<HTMLFormElement | null>;
    formAction: (formData: FormData) => void;
    isPending: boolean;
    value: string;
    error?: string;
    className?: string;
}

export default function CommentForm({ formRef, formAction, value, error, isPending, className }: Readonly<CommentFormProps>) {
    const handleSubmitComment = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (formRef.current) {
                formRef.current.requestSubmit();
            }
        }
    }

    return (
        <form ref={formRef} action={formAction} className="w-full ">
            <MessageInput
                placeholder="Add a comment..."
                name="body"
                className={className}
                onKeyDown={handleSubmitComment}
                error={error}
                disabled={isPending}
                value={value}
            />
        </form>
    )
}
