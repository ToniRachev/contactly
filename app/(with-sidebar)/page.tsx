import PostsList from "@/components/post/posts-list";
import { fetchPosts } from "@/lib/actions/post/post.actions"
import { getUserId } from "@/lib/actions/user/user.actions";

export default async function Home() {
  const userId = await getUserId();
  const posts = await fetchPosts(userId);

  return (
    <div className="">
      <h4>Feed</h4>

      <div className="pt-12 flex flex-col gap-24 w-full items-center">
        <PostsList posts={posts} />
      </div>
    </div>
  )
}
