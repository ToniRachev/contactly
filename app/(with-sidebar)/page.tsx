import Post from "@/components/post"

const posts = [
  {
    avatar: '/user_avatar.webp',
    authorName: 'Elias Monroe',
    postedAt: '2 hours ago',
    content: 'Just finished this piece after a week of late nights and too much tea ☕ It’s inspired by the feeling of getting lost in thought during a slow walk home. What do you see in it? I love hearing how others interpret my work.',
    likes: 2598,
    comments: 150,
    areFriends: true,
  },
  {
    avatar: '/user_avatar.webp',
    authorName: 'Elias Monroe',
    postedAt: '2 days ago',
    content: 'Just finished this piece after a week of late nights and too much tea ☕ It’s inspired by the feeling of getting lost in thought during a slow walk home. What do you see in it? I love hearing how others interpret my work.',
    likes: 2598,
    comments: 150,
    areFriends: false,
  }
]

export default async function Home() {
  return (
    <div className="">
      <h4>Feed</h4>

      <div className="pt-12 flex flex-col gap-24 w-full items-center">
        {posts.map((post) => (
          <Post key={post.postedAt} {...post} />
        ))}
      </div>
    </div>
  )
}
