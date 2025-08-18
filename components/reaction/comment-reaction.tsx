import { MessageCircle } from "lucide-react";
import ReactionItem from "./reaction-item";

type CommentsProps = {
    count: number;
    onClick?: () => void;
}

export default function CommentReaction({ count, onClick }: Readonly<CommentsProps>) {
    return (
        <button onClick={onClick}>
            <ReactionItem
                icon={<MessageCircle />}
                count={count}
            />
        </button>
    )
}