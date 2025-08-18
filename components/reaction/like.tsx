import { Heart } from "lucide-react";
import ReactionItem from "./reaction-item";
import clsx from "clsx";

type LikeProps = {
    isLiked: boolean;
    count: number;
    like: () => void;
}

export default function Like({ isLiked, count, like }: Readonly<LikeProps>) {
    return (
        <button onClick={like}>
            <ReactionItem
                icon={<Heart className={clsx('', isLiked && 'stroke-red-500 fill-red-700')} />}
                count={count}
            />
        </button>
    )
}