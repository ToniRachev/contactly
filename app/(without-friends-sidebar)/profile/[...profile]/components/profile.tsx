import { fetchUserPhotos } from "@/lib/actions/photos/photos.actions";
import { fetchUserPosts } from "@/lib/actions/post/post.actions";
import About from "./about";
import PhotosList from "./photos-list";
import PostsListWrapper from "@/components/post/posts-list";
import { UserProfileType } from "@/lib/types/user";

type ProfileProps = {
    profileId: string;
    profile: UserProfileType;
}

export default async function Profile({ profileId, profile }: Readonly<ProfileProps>) {
    const [posts, photos] = await Promise.all([
        fetchUserPosts(profileId),
        fetchUserPhotos(profileId, 9),
    ]);

    return (
        <div className="flex gap-48">
            <div className=" w-1/3 rounded-lg space-y-4">
                <About user={profile} />
                <PhotosList photos={photos} profileId={profileId} />
            </div>
            <div className="flex flex-col gap-24 w-full">
                <PostsListWrapper posts={posts} />
            </div>
        </div>
    )
}