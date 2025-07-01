'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { PostType } from "../utils/supabase/types/post";

type PostsContextType = {
    posts: PostType[];
    addPost: (post: PostType) => void;
    editPost: (postId: string, newContent: string) => void;
    deletePost: (postId: string) => void;
    postReaction: (postId: string, userId: string, isLikedPost: boolean) => void;
}

const PostsContext = createContext<PostsContextType | null>(null);

type PostsProviderProps = {
    postsData: PostType[];
    children: ReactNode;
}

export default function PostsProvider({ postsData, children }: Readonly<PostsProviderProps>) {
    const [posts, setPosts] = useState<PostType[]>(postsData);

    const addPost = useCallback((post: PostType) => setPosts((prevPosts) => [post, ...prevPosts]), [setPosts]);

    const editPost = useCallback((postId: string, newContent: string) => {
        setPosts((prevPosts) => {
            const updatedPosts = [...prevPosts];
            const post = updatedPosts.find((post) => post.postId === postId);

            if (post) {
                post.body = newContent;
            }

            return updatedPosts;
        })
    }, [setPosts])

    const deletePost = useCallback((postId: string) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
    }, [setPosts])

    const postReaction = useCallback((postId: string, userId: string, isLikedPost: boolean) => {
        setPosts((prevPosts) => {
            const updatedPosts = [...prevPosts];
            const postIndex = updatedPosts.findIndex((post) => post.postId === postId);

            if (postIndex === -1) {
                return prevPosts;
            }

            const post = updatedPosts[postIndex];

            if (!isLikedPost) {
                post.likesCount++
                post.likes.push(userId);
            } else {
                post.likesCount--
                post.likes = post.likes.filter((userLikedPostId) => userLikedPostId !== userId)
            }

            const updatedPost = { ...post };
            updatedPosts[postIndex] = updatedPost;

            return updatedPosts;
        })
    }, [setPosts])

    const contextValue = useMemo(() => ({
        posts,
        addPost,
        editPost,
        deletePost,
        postReaction
    }), [posts, addPost, editPost, deletePost, postReaction]);

    return (
        <PostsContext.Provider value={contextValue}>
            {children}
        </PostsContext.Provider>
    )
}

export function usePosts() {
    const context = useContext(PostsContext);

    if (!context) {
        throw new Error('usePosts must be used inside a PostsProvider')
    }

    return { ...context };
}