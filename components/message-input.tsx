import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";

type MessageInputProps = {
    placeholder: string;
    name: string;
    value?: string;
    className?: string;
}

export default function MessageInput({ placeholder, name, value = '', className }: Readonly<MessageInputProps>) {
    return (
        <div className="relative w-full">
            <Textarea
                placeholder={placeholder}
                name={name}
                defaultValue={value}
                className={clsx(`border-none bg-surface resize-none max-h-[10vh] py-4 min-h-0
             [&::-webkit-scrollbar]:w-2 
            [&::-webkit-scrollbar-track]:bg-surface
            [&::-webkit-scrollbar-thumb]:bg-[#8C8C8C]
            [&::-webkit-scrollbar-button]:hidden`, className)} />
        </div>
    )
}