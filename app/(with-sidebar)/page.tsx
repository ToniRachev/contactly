import PostsList from "@/components/post/posts-list";
import { fetchPosts } from "@/lib/actions/post/post.actions"
import { getAuthUserId } from "@/lib/actions/user/user.actions";

export default async function Home() {
  const userId = await getAuthUserId();
  const posts = await fetchPosts(userId);

  return (
    <div className="w-full">
      <h4>Feed</h4>

      <div className="pt-12 flex flex-col gap-24 w-full max-w-[35vw] items-center mx-auto">
        <PostsList posts={posts} />
      </div>
    </div>
  )
}
