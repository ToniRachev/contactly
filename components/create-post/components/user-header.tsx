import Avatar from "../../user-avatar";

type UserHeaderProps = {
    avatarUrl: string | null;
    fullName: string;
}

export default function UserHeader({ avatarUrl, fullName }: Readonly<UserHeaderProps>) {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                avatar={avatarUrl}
                size={'sm'}
            />

            <p>{fullName}</p>
        </div>
    )
}