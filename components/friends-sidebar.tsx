'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from '@/components/ui/sidebar'
import UserAvatarWithStatus from './user-avatar-with-status';
import { PresenceStatusType } from '@/lib/types/user';
import { useFriends } from '@/lib/context/friends.context';

type FriendCardProps = {
    avatar: string | null;
    name: string;
    status: PresenceStatusType;
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
    const { friends } = useFriends();

    return (
        <Sidebar className='!border-0' side='right'>
            <SidebarHeader className='py-12 pl-4'>
                <h6>Friends</h6>
            </SidebarHeader>
            <SidebarContent className='flex gap-6  pl-8'>
                {friends.map((friend) => (
                    <FriendCard key={friend.id} avatar={friend.avatarUrl} name={friend.fullName} status={friend.presenceStatus} />
                ))}
            </SidebarContent>
        </Sidebar>
    )
}