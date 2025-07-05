import Image from "next/image";
import { getUserId } from "@/lib/actions/user/user.actions";
import { fetchUserPosts } from "@/lib/actions/post/post.actions";
import PostsListWrapper from "@/components/post/posts-list";
import EditProfile from "@/app/(without-friends-sidebar)/profile/components/edit-profile";
import UserData from "@/app/(without-friends-sidebar)/profile/components/user-data";

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

                <div className="absolute -bottom-24 left-4 flex justify-between w-full">
                    <UserData />
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