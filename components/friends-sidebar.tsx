import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from '@/components/ui/sidebar'
import UserAvatar from './user-avatar';
import clsx from 'clsx';

const friends = [
    {
        avatar: '/user_avatar.webp',
        name: 'Ava Morales',
        status: 'online'
    },
    {
        avatar: '/user_avatar_2.png',
        name: 'Zoe Carter',
        status: 'online'
    },
    {
        avatar: '/user_avatar_3.png',
        name: 'Maya Sinclair',
        status: 'online'
    },
    {
        avatar: '/user_avatar_4.png',
        name: 'Elise Romero',
        status: 'offline'
    },
    {
        avatar: '/user_avatar_5.png',
        name: 'Isla Monroe',
        status: 'offline'
    },
]

type FriendCardProps = {
    avatar: string;
    name: string;
    status: string;
}

const FriendCard = ({ avatar, name, status }: FriendCardProps) => {
    return (
        <div className='flex items-center gap-4'>
            <div className='relative'>
                <UserAvatar avatar={avatar} width={40} height={40} />
                <div className={
                    clsx(
                        'w-2 h-2 absolute bottom-0 right-1 rounded-full',
                        status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                    )
                } />
            </div>
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