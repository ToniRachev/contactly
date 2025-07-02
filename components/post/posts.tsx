'use client';

import { usePosts } from "@/lib/context/posts";
import PostWrapper from "../post/post-wrapper";

export default function Posts() {
    const { posts } = usePosts();

    return (
        <div className="w-[50vw] grid gap-24">
            {posts.map((post) => (
                <PostWrapper
                    key={post.postId}
                    postData={post}
                />
            ))}
        </div>
    )
}