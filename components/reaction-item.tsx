import { ReactNode } from "react";

type ReactionItemProps = {
    icon: ReactNode;
    count: number;
}

export default function ReactionItem({ icon, count }: Readonly<ReactionItemProps>) {
    return (
        <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-600 p-2 rounded-full">
            {icon}
            <p>{count}</p>
        </div>
    )
}