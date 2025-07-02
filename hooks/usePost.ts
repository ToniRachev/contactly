import { useUser } from "@/lib/context/user";
import { PostType } from "@/lib/utils/supabase/types/post"
import { startTransition, useCallback, useOptimistic, useState } from "react"

export default function usePost(post: PostType) {
    const [optimisticPost, updatePost] = useOptimistic<PostType>(post);
    const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);

    const { user } = useUser();

    const isLikedPost = !!optimisticPost.likes.find((userLikedPostId) => userLikedPostId === user?.id);

    const handleDetailedViewState = (state: boolean) => setIsDetailedViewOpen(state);

    const openDetailedView = () => setIsDetailedViewOpen(true);

    const closeDetailedView = () => setIsDetailedViewOpen(false);

    const reaction = useCallback(() => {
        if (user) {
            const userId = user.id;

            startTransition(() => {
                updatePost((prevState) => ({
                    ...prevState,
                    likes: isLikedPost ? prevState.likes.filter((userLikedPostId) => userLikedPostId !== userId) : [...prevState.likes, userId],
                    likesCount: isLikedPost ? prevState.likesCount - 1 : prevState.likesCount + 1
                }))
            })
        }
    }, [isLikedPost, updatePost, user])

    return {
        post: optimisticPost,
        isLikedPost,
        controls: {
            handleDetailedViewState,
            openDetailedView,
            closeDetailedView,
            isDetailedViewOpen
        },
        reaction,
    }
}