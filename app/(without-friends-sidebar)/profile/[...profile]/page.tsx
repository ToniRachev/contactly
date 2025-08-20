import Cover from "./components/cover";
import UserData from "./components/user-data";
import { fetchUserProfile, getAuthUserId } from "@/lib/actions/user/user.actions";
import Profile from "./components/profile";
import UserPhotos from "./components/user-photos";
import ProfileNavigation from "./components/profile-navigation";

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
            <div className="w-full relative">
                <Cover coverUrl={userProfile.coverUrl} />

                <div className="absolute -bottom-42 px-8 w-full space-y-4">
                    <UserData
                        fullName={userProfile.fullName}
                        avatarUrl={userProfile.avatarUrl}
                        isOwnProfile={isOwnProfile}
                    />

                    <ProfileNavigation profileId={profileId} />
                </div>

            </div>
            <div className="pt-56 px-8">
                {content}
            </div>
        </div>
    )
}