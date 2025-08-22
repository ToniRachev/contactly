'use client';

import PostsProvider, { usePosts } from "@/lib/context/posts.context";
import CreatePost from "../create-post";
import PostWrapper from "./post-wrapper";
import { PostType } from "@/lib/types/post";

type PostsListWrapperProps = {
    posts: PostType[];
    showCreatePost?: boolean;
}

const PostsList = () => {
    const { posts } = usePosts();

    return (
        <div className="grid gap-24">
            {posts.map((post) => (
                <PostWrapper
                    key={post.postId}
                    postData={post}
                />
            ))}
        </div>
    )
}

export default function PostsListWrapper({ posts, showCreatePost = true }: Readonly<PostsListWrapperProps>) {
    return (
        <PostsProvider postsData={posts}>
            <div className="space-y-24 max-w-[35vw] w-full">
                {showCreatePost && <CreatePost />}
                <PostsList />
            </div>
        </PostsProvider>
    )
}