import UserProfileCard from "@/components/user-profile-card";

type UserDataProps = {
    fullName: string;
    avatarUrl: string | null;
}

export default function UserData({ fullName, avatarUrl }: Readonly<UserDataProps>) {
    return (
        <div>
            <UserProfileCard
                name={fullName}
                className="items-start"
                avatar={avatarUrl}
            />
        </div>
    )
}