import CreatePost from "@/components/create-post"
import PostWrapper from "@/components/post-wrapper"
import { fetchFeed } from "@/lib/utils/supabase/actions/post/post"
import { getUserId } from "@/lib/utils/supabase/actions/user/user";

export default async function Home() {
  const userId = await getUserId();
  const feeds = await fetchFeed(userId);

  return (
    <div className="">
      <h4>Feed</h4>

      <div className="pt-12 flex flex-col gap-24 w-full items-center">
        <CreatePost />

        {feeds.map((feed) => (
          <PostWrapper
            key={feed.createdAt}
            post={feed}
            userId={userId}
          />
        ))}
      </div>
    </div>
  )
}
