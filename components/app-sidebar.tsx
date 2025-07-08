'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import UserProfileCard from './user-profile-card'
import { useUser } from '@/lib/context/user.context'
import { NAVIGATION } from '@/lib/constants/navigation'
import { useFriends } from '@/lib/context/friends.context';

type MenuItemProps = {
    children: React.ReactNode
    url?: string
    onClick?: () => void
}

type MenuItemIconProps = {
    icon: LucideIcon
    title: string
}

const MenuItemIcon = ({ icon, title }: MenuItemIconProps) => {
    const Icon = icon;
    return (
        <div className='flex items-center gap-2'>
            <Icon />
            <span>{title}</span>
        </div>
    )
}

const MenuItem = ({ children, url, onClick }: MenuItemProps) => {
    if (onClick) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton className='text-xl py-6' onClick={onClick}>
                    {children}
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild className='text-xl py-6'>
                <Link href={url || '/'}>
                    {children}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export default function AppSidebar() {
    const { user } = useUser();
    const { friendRequests } = useFriends();

    return (
        <Sidebar className='!border-0'>
            <SidebarHeader className='pb-12 pt-8'>
                <Link href={'/'}>
                    <h5>Connectly</h5>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className='pb-8'>
                    <SidebarGroupContent>
                        <UserProfileCard
                            name={user.fullName}
                            avatar={user.avatarUrl}
                        />
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <MenuItem url={NAVIGATION.HOME.url}>
                                <MenuItemIcon icon={NAVIGATION.HOME.icon} title={NAVIGATION.HOME.title} />
                            </MenuItem>

                            <MenuItem url={NAVIGATION.MESSAGES.url}>
                                <MenuItemIcon icon={NAVIGATION.MESSAGES.icon} title={NAVIGATION.MESSAGES.title} />
                            </MenuItem>

                            <MenuItem url={NAVIGATION.FRIENDS.url}>
                                <div className='flex items-center gap-3 w-full'>
                                    <MenuItemIcon icon={NAVIGATION.FRIENDS.icon} title={NAVIGATION.FRIENDS.title} />
                                    <span className='text-lg text-red-500'>{friendRequests.length}</span>
                                </div>
                            </MenuItem>

                            <MenuItem url={NAVIGATION.PROFILE.url}>
                                <MenuItemIcon icon={NAVIGATION.PROFILE.icon} title={NAVIGATION.PROFILE.title} />
                            </MenuItem>

                            <MenuItem onClick={NAVIGATION.LOGOUT.onClick}>
                                <MenuItemIcon icon={NAVIGATION.LOGOUT.icon} title={NAVIGATION.LOGOUT.title} />
                            </MenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}