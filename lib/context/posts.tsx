'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useOptimistic } from "react";
import { PostType } from "../utils/supabase/types/post";

type PostsContextType = {
    posts: PostType[];
    addPost: (post: PostType) => void;
    editPost: (postId: string, newContent: string) => void;
    deletePost: (postId: string) => void;
}

const PostsContext = createContext<PostsContextType | null>(null);

type PostsProviderProps = {
    postsData: PostType[];
    children: ReactNode;
}

export default function PostsProvider({ postsData, children }: Readonly<PostsProviderProps>) {
    const [posts, setPosts] = useOptimistic<PostType[]>(postsData);

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

    const contextValue = useMemo(() => ({
        posts,
        addPost,
        editPost,
        deletePost,
    }), [posts, addPost, editPost, deletePost]);

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