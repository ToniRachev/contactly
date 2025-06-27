import UserAvatar from "./user-avatar";

type UserProfileCardProps = {
    avatar: string;
    name?: string;
    width?: number;
    height?: number;
}

export default function UserProfileCard({ avatar, name, width, height }: UserProfileCardProps) {
    return (
        <div className='flex flex-col justify-center items-center w-full gap-4'>
            <UserAvatar avatar={avatar} width={width} height={height} />
            <h6>{name}</h6>
        </div>
    )
}