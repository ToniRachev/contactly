'use client';

import { useState } from "react";
import Post from "./post";
import { PostView } from "./post-view";
import { FeedType } from "@/lib/utils/supabase/types/post";

type PostWrapperProps = {
    post: FeedType;
    userId: string;
}

export default function PostWrapper({ post, userId }: Readonly<PostWrapperProps>) {
    const [open, setOpen] = useState(false);

    const handleState = (state: boolean) => setOpen(state);

    return (
        <div>
            <Post
                post={post}
                open={() => setOpen(true)}
                userId={userId}
            />
            <PostView
                post={post}
                userId={userId}
                controls={{ setState: handleState, open }}
            />
        </div>
    )
}