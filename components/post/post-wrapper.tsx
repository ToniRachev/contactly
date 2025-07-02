'use client';

import Post from "./post";
import { PostDetailedView } from "./post-detailed-view";
import { PostType } from "@/lib/utils/supabase/types/post";
import usePost from "@/hooks/usePost";

type PostWrapperProps = {
    postData: PostType;
}

export default function PostWrapper({ postData }: Readonly<PostWrapperProps>) {
    const { post, isLikedPost, controls, reaction } = usePost(postData);

    return (
        <div>
            <Post
                post={post}
                open={controls.openDetailedView}
                reaction={reaction}
                isLikedPost={isLikedPost}
            />
            <PostDetailedView
                post={post}
                controls={{ setState: controls.handleDetailedViewState, open: controls.isDetailedViewOpen }}
                reaction={reaction}
                isLikedPost={isLikedPost}
            />
        </div>
    )
}