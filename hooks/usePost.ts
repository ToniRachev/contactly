import { useAuthenticatedUser } from "@/lib/context/user.context";
import { PostType } from "@/lib/types/post"
import { useCallback, useState } from "react"

export default function usePost(postData: PostType) {
    const [post, setPost] = useState<PostType>(postData);
    const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);

    const { user } = useAuthenticatedUser();

    const isLikedPost = !!post.likes.find((userLikedPostId) => userLikedPostId === user.id);

    const handleDetailedViewState = (state: boolean) => setIsDetailedViewOpen(state);

    const openDetailedView = () => setIsDetailedViewOpen(true);

    const closeDetailedView = () => setIsDetailedViewOpen(false);

    const updateCommentsCount = useCallback((type: 'add' | 'remove') => {
        setPost((prevState) => ({
            ...prevState,
            commentsCount: type === 'add' ? prevState.commentsCount + 1 : prevState.commentsCount - 1
        }));
    }, []);

    const reaction = useCallback(() => {
        const userId = user.id;
        setPost((prevState) => ({
            ...prevState,
            likes: isLikedPost ? prevState.likes.filter((userLikedPostId) => userLikedPostId !== userId) : [...prevState.likes, userId],
            likesCount: isLikedPost ? prevState.likesCount - 1 : prevState.likesCount + 1
        }))
    }, [isLikedPost, setPost, user])

    return {
        post: post,
        isLikedPost,
        controls: {
            handleDetailedViewState,
            openDetailedView,
            closeDetailedView,
            isDetailedViewOpen,
        },
        reaction,
        updateCommentsCount
    }
}