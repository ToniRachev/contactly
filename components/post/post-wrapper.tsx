'use client';

import Post from "./post";
import { PostDetailedView } from "./post-detailed-view";
import { PostType, CommentType } from "@/lib/utils/supabase/types/post";
import usePost from "@/hooks/usePost";
import { useEffect, useState } from "react";
import { fetchPostComments } from "@/lib/utils/supabase/client/post.client";

type PostWrapperProps = {
    postData: PostType;
}

export default function PostWrapper({ postData }: Readonly<PostWrapperProps>) {
    const { post, isLikedPost, controls, reaction } = usePost(postData);
    const [comments, setComments] = useState<CommentType[]>([]);

    useEffect(() => {
        if (controls.isDetailedViewOpen) {
            (async function () {
                const comments = await fetchPostComments(post.postId);
                setComments(comments);
            })()
        }

    }, [controls.isDetailedViewOpen, post.postId, post.commentsCount])


    return (
        <div>
            <Post
                post={post}
                reaction={reaction}
                isLikedPost={isLikedPost}
                open={controls.openDetailedView}
            />

            <PostDetailedView
                post={post}
                controls={{ setState: controls.handleDetailedViewState, open: controls.isDetailedViewOpen }}
                reaction={reaction}
                isLikedPost={isLikedPost}
                commentsData={comments}
            />
        </div>
    )
}