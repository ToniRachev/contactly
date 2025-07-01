import UserProfileCard from "@/components/user-profile-card";
import Image from "next/image";
import EditProfile from "./components/edit-profile";
import { getUserId } from "@/lib/utils/supabase/actions/user/user.actions";
import { fetchUserPosts } from "@/lib/utils/supabase/actions/post/post.actions";
import PostsListWrapper from "@/components/post/posts-wrapper";

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
                <PostsListWrapper posts={posts} />
            </div>
        </div>
    )
}