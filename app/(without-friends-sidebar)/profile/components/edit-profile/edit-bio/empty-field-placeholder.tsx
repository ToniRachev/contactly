import { CirclePlus } from "lucide-react";

type EmptyFieldPlaceholderProps = {
    openEditing: () => void;
    placeholder: string;
}

export default function EmptyFieldPlaceholder({ openEditing, placeholder }: Readonly<EmptyFieldPlaceholderProps>) {
    return (
        <li>
            <button
                onClick={openEditing}
            >
                <div className="flex items-center gap-2 py-2 cursor-pointer w-fit">
                    <CirclePlus />
                    <p>{placeholder}</p>
                </div>
            </button>
        </li>
    )
}