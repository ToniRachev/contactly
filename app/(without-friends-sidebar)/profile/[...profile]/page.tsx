import Cover from "./components/cover";
import UserData from "./components/user-data";
import EditProfile from "./components/edit-profile";
import { fetchUserProfile, getAuthUserId } from "@/lib/actions/user/user.actions";
import Profile from "./components/profile";
import UserPhotos from "./components/user-photos";

type ProfilePageProps = {
    params: Promise<{
        profile: string[];
    }>
}

export default async function ProfilePage({ params }: Readonly<ProfilePageProps>) {
    const { profile: [profileId, section] } = await params;

    const [userProfile, authUserId] = await Promise.all([
        fetchUserProfile(profileId),
        getAuthUserId()
    ]);

    const isOwnProfile = authUserId === userProfile.id;

    const content = section === "photos" ? <UserPhotos profileId={profileId} /> : <Profile profileId={profileId} profile={userProfile} />;

    return (
        <div>
            <div className="w-full h-[50svh] relative">
                <Cover coverUrl={userProfile.coverUrl} />

                <div className="absolute -bottom-24 left-4 flex justify-between w-full">
                    <UserData fullName={userProfile.fullName} avatarUrl={userProfile.avatarUrl} />
                </div>

                {isOwnProfile && (
                    <div className="absolute -bottom-20 right-14">
                        <EditProfile />
                    </div>
                )}
            </div>

            <div className="pt-36">
                {content}
            </div>
        </div>
    )
}