import Post from "@/components/post";
import UserProfileCard from "@/components/user-profile-card";
import Image from "next/image";
import EditProfile from "./components/edit-profile";
import CreatePost from "@/components/create-post";

const posts = [
    {
        avatar: '/user_avatar.webp',
        authorName: 'Traveler Jane',
        postedAt: '2 hours ago',
        content: 'Just finished this piece after a week of late nights and too much tea ☕ It’s inspired by the feeling of getting lost in thought during a slow walk home. What do you see in it? I love hearing how others interpret my work.',
        likes: 2598,
        comments: 150,
        areFriends: false,
    },
    {
        avatar: '/user_avatar.webp',
        authorName: 'Traveler Jane',
        postedAt: '2 days ago',
        content: 'Just finished this piece after a week of late nights and too much tea ☕ It’s inspired by the feeling of getting lost in thought during a slow walk home. What do you see in it? I love hearing how others interpret my work.',
        likes: 2598,
        comments: 150,
        areFriends: false,
    }
]

export default function Profile() {
    return (
        <div>
            <div className="w-full h-[50svh] relative">
                <Image
                    src={'/user_profile_background.png'}
                    alt="User cover photo"
                    fill
                    className="object-cover"
                />

                <div className="absolute -bottom-24 -left-14 flex justify-between w-full">
                    <div>
                        <UserProfileCard
                            avatar={'/user_avatar.webp'}
                            name='Traveler Jane'
                        />
                        <p className="ml-17">From Havenbrook, Canada</p>
                    </div>
                </div>

                <div className="absolute -bottom-20 right-14">
                    <EditProfile />
                </div>
            </div>

            <div className="flex justify-center items-center flex-col pt-36 gap-24">
                <CreatePost />

                {posts.map((post) => (
                    <Post key={post.postedAt} {...post} />
                ))}
            </div>
        </div>
    )
}