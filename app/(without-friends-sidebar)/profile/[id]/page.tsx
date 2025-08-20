import { fetchUserPosts } from "@/lib/actions/post/post.actions";
import PostsListWrapper from "@/components/post/posts-list";
import Cover from "./components/cover";
import UserData from "./components/user-data";
import EditProfile from "./components/edit-profile";
import { fetchUserProfile } from "@/lib/actions/user/user.actions";
import About from "./components/about";
import { fetchUserPhotos } from "@/lib/actions/photos/photos.actions";
import PhotosList from "./components/photos-list";

type ProfilePageProps = {
    params: Promise<{
        id: string;
    }>
}

export default async function Profile({ params }: Readonly<ProfilePageProps>) {
    const { id } = await params;

    const [userProfile, posts, photos] = await Promise.all([
        fetchUserProfile(id),
        fetchUserPosts(id),
        fetchUserPhotos(id)
    ]);

    return (
        <div>
            <div className="w-full h-[50svh] relative">
                <Cover coverUrl={userProfile.coverUrl} />

                <div className="absolute -bottom-24 left-4 flex justify-between w-full">
                    <UserData fullName={userProfile.fullName} avatarUrl={userProfile.avatarUrl} />
                </div>

                <div className="absolute -bottom-20 right-14">
                    <EditProfile />
                </div>
            </div>

            <div className="pt-36 flex gap-48">
                <div className=" w-1/3 rounded-lg space-y-4">
                    <About user={userProfile} />
                    <PhotosList photos={photos} />
                </div>
                <div className="flex flex-col gap-24 w-full">
                    <PostsListWrapper posts={posts} />
                </div>
            </div>
        </div>
    )
}