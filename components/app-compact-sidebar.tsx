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
import { Compass, LogOut, MessageCircle, UserRound, UsersRound } from 'lucide-react'
import Link from 'next/link'
import UserProfileCard from './user-profile-card'
import { signout } from '@/lib/utils/supabase/actions/auth/auth'

const menuItems = [
    {
        title: 'News feed',
        url: '/',
        icon: Compass,
    },
    {
        title: 'Messages',
        url: '/messages',
        icon: MessageCircle,
    },
    {
        title: 'Friends',
        url: '/',
        icon: UsersRound,
    },
    {
        title: 'Profile',
        url: '/',
        icon: UserRound,
    }
]

export default function AppCompactSidebar() {
    return (
        <Sidebar className='!border-0 w-[10vw]'>
            <SidebarHeader className='pb-12 pt-8'>
                <Link href={'/'}>
                    <h5>Connectly</h5>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className='pb-8'>
                    <SidebarGroupContent>
                        <UserProfileCard
                            avatar='/user_avatar.webp'
                            width={80}
                            height={80}
                        />
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className='py-6'>
                                        <Link href={item.url}>
                                            <item.icon />
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    onClick={signout}
                                    className='text-xl cursor-pointer py-6'
                                >
                                    <div>
                                        <LogOut />
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}