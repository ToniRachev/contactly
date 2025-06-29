'use client';

import { useState } from "react";
import Post, { PostProps } from "./post";
import { PostView } from "./post-view";

const comments = [
    {
        id: '1',
        createdAt: '15 mins ago',
        author: {
            name: 'Zoe Carter',
            avatar: '/user_avatar_2.png',
        },
        body: 'This is a comment on the post.',
        likes: 5
    },
    {
        id: '2',
        createdAt: '10 mins ago',
        author: {
            name: 'Liam Bennett',
            avatar: '/user_avatar_4.png',
        },
        body: 'Really interesting perspective. I hadn’t thought of it that way.',
        likes: 3
    },
    {
        id: '3',
        createdAt: '8 mins ago',
        author: {
            name: 'Maya Collins',
            avatar: '/user_avatar_5.png',
        },
        body: 'I agree with this completely. Thanks for sharing!',
        likes: 7
    },
    {
        id: '4',
        createdAt: '5 mins ago',
        author: {
            name: 'Noah Ellis',
            avatar: '/user_avatar_2.png',
        },
        body: 'Can you explain this a bit more? I’m curious.',
        likes: 2
    },
    {
        id: '5',
        createdAt: 'Just now',
        author: {
            name: 'Ella Rivera',
            avatar: '/user_avatar_4.png',
        },
        body: 'This really helped me understand the topic better.',
        likes: 4,
    }
]



export default function PostWrapper({ post }: Readonly<{ post: PostProps }>) {
    const [open, setOpen] = useState(false);

    const handleState = (state: boolean) => setOpen(state);

    return (
        <div>
            <Post {...post} open={() => setOpen(true)} />
            <PostView post={post} comments={comments} controls={{ setState: handleState, open }} />
        </div>
    )
}