'use client';

import { useState } from "react";
import Post from "./post";
import { PostDetailedView } from "./post-detailed-view";
import { PostType } from "@/lib/utils/supabase/types/post";

type PostWrapperProps = {
    post: PostType;
}

export default function PostWrapper({ post }: Readonly<PostWrapperProps>) {
    const [open, setOpen] = useState(false);

    const handleState = (state: boolean) => setOpen(state);

    return (
        <div>
            <Post
                post={post}
                open={() => setOpen(true)}
            />
            <PostDetailedView
                post={post}
                controls={{ setState: handleState, open }}
            />
        </div>
    )
}