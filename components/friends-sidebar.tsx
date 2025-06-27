import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from '@/components/ui/sidebar'
import UserAvatarWithStatus from './user-avatar-with-status';
import { StatusType } from '@/lib/utils/supabase/types/user';

const friends = [
    {
        avatar: '/user_avatar.webp',
        name: 'Ava Morales',
        status: 'online' as StatusType
    },
    {
        avatar: '/user_avatar_2.png',
        name: 'Zoe Carter',
        status: 'online' as StatusType
    },
    {
        avatar: '/user_avatar_3.png',
        name: 'Maya Sinclair',
        status: 'online' as StatusType
    },
    {
        avatar: '/user_avatar_4.png',
        name: 'Elise Romero',
        status: 'offline' as StatusType
    },
    {
        avatar: '/user_avatar_5.png',
        name: 'Isla Monroe',
        status: 'offline' as StatusType
    },
]

type FriendCardProps = {
    avatar: string;
    name: string;
    status: StatusType;
}

const FriendCard = ({ avatar, name, status }: FriendCardProps) => {
    return (
        <div className='flex items-center gap-4'>
            <UserAvatarWithStatus
                avatar={avatar}
                status={status}
            />
            <p>{name}</p>
        </div>
    )
}

export default function FriendsSidebar() {
    return (
        <Sidebar className='!border-0' side='right'>
            <SidebarHeader className='py-12 pl-4'>
                <h6>Friends</h6>
            </SidebarHeader>
            <SidebarContent className='flex gap-6  pl-8'>
                {friends.map((friend) => (
                    <FriendCard key={friend.name} {...friend} />
                ))}
            </SidebarContent>
        </Sidebar>
    )
}