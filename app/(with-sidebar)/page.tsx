import PostsList from "@/components/post/posts-wrapper";
import { fetchPosts } from "@/lib/utils/supabase/actions/post/post.actions"
import { getUserId } from "@/lib/utils/supabase/actions/user/user.actions";

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
