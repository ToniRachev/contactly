import UserProfileCard from "@/components/user-profile-card";
import Image from "next/image";
import EditProfile from "./components/edit-profile";
import CreatePost from "@/components/create-post";
import { getUserId } from "@/lib/utils/supabase/actions/user/user";
import { fetchUserPosts } from "@/lib/utils/supabase/actions/post/post";
import PostWrapper from "@/components/post-wrapper";

export default async function Profile() {
    const userId = await getUserId();
    const posts = await fetchUserPosts(userId);

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
                    <PostWrapper
                        key={post.postId}
                        post={post}
                        userId={userId}
                    />
                ))}
            </div>
        </div>
    )
}