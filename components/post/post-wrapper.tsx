'use client';

import Post from "./post";
import { PostDetailedView } from "@/components/post/post-detailed-view";
import { PostType } from "@/lib/types/post";
import usePost from "@/hooks/usePost";
import useComments from "@/hooks/useComments";

type PostWrapperProps = {
    postData: PostType;
}

export default function PostWrapper({ postData }: Readonly<PostWrapperProps>) {
    const { post, isLikedPost, controls, reaction, updateCommentsCount } = usePost(postData);
    const { comments, addComment, editComment, deleteComment, reactionComment } = useComments(
        controls.isDetailedViewOpen,
        post.postId,
        updateCommentsCount,
    );

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
                comments={comments}
                addComment={addComment}
                editComment={editComment}
                deleteComment={deleteComment}
                reactionComment={reactionComment}
            />
        </div>
    )
}