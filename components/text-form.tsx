import MessageInput from "@/components/message-input";
import { parseAndValidateFormData } from "@/lib/utils";
import { commentSchema } from "@/lib/validations/postSchema";
import clsx from "clsx";
import { forwardRef, useImperativeHandle, useRef } from "react";

type TextFormProps = {
    onSubmit: (content: string) => void;
    className?: string;
    value?: string;
    name: string;
    placeholder: string;
}

export type TextFormHandle = {
    triggerSubmit: () => void;
}

export default forwardRef(function TextForm({ onSubmit, className, value, name, placeholder }: Readonly<TextFormProps>, ref: React.Ref<TextFormHandle>) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async () => {
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);

        const { data, result } = parseAndValidateFormData(formData, commentSchema, [name]);

        if (result.success) {
            onSubmit(data[name] as string);
            formRef.current.reset();
        }
    }

    const formAction = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== 'Enter' || e.shiftKey || !formRef.current) return;
        e.preventDefault();
        handleSubmit();
    }

    useImperativeHandle(ref, () => ({
        triggerSubmit: handleSubmit
    }));

    return (
        <div className={clsx('w-full', className)}>
            <form ref={formRef}>
                <MessageInput
                    name={name}
                    placeholder={placeholder}
                    onKeyDown={formAction}
                    value={value}
                />
            </form>
        </div>
    )
})
