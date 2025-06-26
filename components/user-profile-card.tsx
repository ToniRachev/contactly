import UserAvatar from "./user-avatar";

type UserProfileCardProps = {
    avatar: string,
    name: string
}

export default function UserProfileCard({ avatar, name }: UserProfileCardProps) {
    return (
        <div className='flex flex-col justify-center items-center w-full gap-4'>
            <UserAvatar avatar={avatar} />
            <h6>{name}</h6>
        </div>
    )
}