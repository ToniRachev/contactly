import { PresenceStatusType } from "@/lib/types/user";
import Avatar from "./user-avatar";
import { cva } from "class-variance-authority";

type UserAvatarWithStatusProps = {
    avatar: string | null;
    size?: 'sm' | 'md';
    status: PresenceStatusType | null;
}

const statusDot = cva('absolute bottom-0 right-1 rounded-full', {
    variants: {
        status: {
            online: 'bg-green-500',
            offline: 'bg-gray-300',
            idle: 'bg-yellow-500'
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

export default function UserAvatarWithStatus({
    avatar,
    status,
    size = 'sm'
}: Readonly<UserAvatarWithStatusProps>) {
    return (
        <div className='relative'>
            <Avatar avatar={avatar} size={size} />
            {status && <div className={statusDot({ status, size })} />}
        </div>
    )
}