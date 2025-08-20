import UserProfileCard from "@/components/user-profile-card";
import EditProfile from "./edit-profile";

type UserDataProps = {
    fullName: string;
    avatarUrl: string | null;
    isOwnProfile: boolean;
}

export default function UserData({ fullName, avatarUrl, isOwnProfile }: Readonly<UserDataProps>) {
    return (
        <div className="flex justify-between w-full">
            <div className="flex items-center justify-between w-full">
                <UserProfileCard
                    name={fullName}
                    className="items-center flex-row"
                    avatar={avatarUrl}
                />

                {isOwnProfile && (
                    <div className="">
                        <EditProfile />
                    </div>
                )}
            </div>
        </div>
    )
}