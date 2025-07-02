import PostsProvider from "@/lib/context/posts.context";
import Posts from "./posts";
import { PostType } from "@/lib/utils/supabase/types/post";
import CreatePost from "../create-post";

type PostsListWrapperProps = {
    posts: PostType[];
}

export default function PostsListWrapper({ posts }: Readonly<PostsListWrapperProps>) {
    return (
        <PostsProvider postsData={posts}>
            <CreatePost />
            <Posts />
        </PostsProvider>
    )
}