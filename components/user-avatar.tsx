import Image from "next/image";

type UserAvatarProps = {
    avatar: string;
    width?: number;
    height?: number;
}

export default function UserAvatar({ avatar, width = 120, height = 120 }: UserAvatarProps) {
    return (
        <div className="flex items-center justify-center">
            <Image
                src={avatar}
                alt="User avatar"
                width={width}
                height={height}
                className="rounded-full"
            />
        </div>
    )
}