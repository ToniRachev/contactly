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
import { Compass, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'
import UserAvatar from './user-avatar'
import UserProfileCard from './user-profile-card'

const menuItems = [
    {
        title: 'News feed',
        url: '/',
        icon: Compass,
    },
    {
        title: 'Messages',
        url: '/',
        icon: MessageCircle,
    },
    {
        title: 'Friends',
        url: '/',
        icon: MessageCircle,
    },
    {
        title: 'Profile',
        url: '/',
        icon: User,
    }
]

export default function AppSidebar() {
    return (
        <Sidebar className='!border-0'>
            <SidebarHeader className='pb-12'>
                <Link href={'/'}>
                    <h5>Connectly</h5>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className='pb-8'>
                    <SidebarGroupContent>
                        <UserProfileCard
                            avatar='/user_avatar.webp'
                            name='Traveler Jane'
                        />
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className='text-xl py-6'>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}