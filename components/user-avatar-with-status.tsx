import clsx from "clsx";
import UserAvatar from "./user-avatar";
import { cva } from "class-variance-authority";

type UserAvatarWithStatusProps = {
    avatar: string;
    size?: 'sm' | 'md';
    status: 'online' | 'offline';
}

const statusDot = cva('absolute bottom-0 right-1 rounded-full', {
    variants: {
        status: {
            online: 'bg-green-500',
            offline: 'bg-gray-300'
        },
        size: {
            sm: 'w-2 h-2',
            md: 'w-4 h-4'
        }
    },
    defaultVariants: {
        status: 'online',
        size: 'sm'
    }
})

const avatarSize = {
    sm: {
        width: 40,
        height: 40
    },
    md: {
        width: 80,
        height: 80
    }
}


export default function UserAvatarWithStatus({
    avatar,
    status,
    size = 'sm'
}: UserAvatarWithStatusProps) {
    return (
        <div className='relative'>
            <UserAvatar avatar={avatar} width={avatarSize[size].width} height={avatarSize[size].height} />
            <div className={statusDot({ status, size })} />
        </div>
    )
}