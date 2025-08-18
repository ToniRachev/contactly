import { useAuthenticatedUser } from "@/lib/context/user.context";
import { PhotoReactionType } from "../lib/types";
import Like from "@/components/reaction/like";
import CommentReaction from "@/components/reaction/comment-reaction";

type PhotoEngagementStatsProps = {
    photoId: string;
    likes: {
        isLiked: boolean;
        count: number;
        reaction: PhotoReactionType;
    }
    comments: {
        count: number;
    }
}

export default function PhotoEngagementStats({ photoId, likes, comments }: Readonly<PhotoEngagementStatsProps>) {
    const { user } = useAuthenticatedUser();

    const handlePhotoReaction = () => {
        likes.reaction(photoId, likes.isLiked, user.id);
    }

    return (
        <div className="space-x-2">
            <Like isLiked={likes.isLiked} count={likes.count} like={handlePhotoReaction} />
            <CommentReaction count={comments.count} />
        </div>
    )
}