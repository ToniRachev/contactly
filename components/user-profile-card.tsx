import Avatar from "./user-avatar";
import clsx from "clsx";

type UserProfileCardProps = {
    avatar: string | null;
    name?: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function UserProfileCard({ avatar, name, className }: Readonly<UserProfileCardProps>) {
    return (
        <div className={clsx('flex flex-col justify-center items-center w-full gap-4', className)}>
            <Avatar avatar={avatar} size={'lg'} />
            <h6>{name}</h6>
        </div>
    )
}