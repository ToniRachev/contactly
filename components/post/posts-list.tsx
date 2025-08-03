'use client';

import PostsProvider, { usePosts } from "@/lib/context/posts.context";
import CreatePost from "../create-post";
import PostWrapper from "./post-wrapper";
import { PostType } from "@/lib/types/post";

type PostsListWrapperProps = {
    posts: PostType[];
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

export default function PostsListWrapper({ posts }: Readonly<PostsListWrapperProps>) {
    return (
        <PostsProvider postsData={posts}>
            <div className="space-y-24 max-w-[35vw] w-full">
                <CreatePost />
                <PostsList />
            </div>
        </PostsProvider>
    )
}