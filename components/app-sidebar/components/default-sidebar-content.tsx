'use client';

import { NAVIGATION } from "@/lib/constants/navigation";
import { MenuItem, MenuItemIcon } from "..";
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "../../ui/sidebar";
import UserProfileCard from "../../user-profile-card";
import { SearchIcon } from "lucide-react";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { useFriends } from "@/lib/context/friends.context";
import { useConversations } from "@/lib/context/conversations.context";

type DefaultSidebarContentProps = {
    openSearch: () => void;
}

export default function DefaultSidebarContent({ openSearch }: Readonly<DefaultSidebarContentProps>) {
    const { user } = useAuthenticatedUser();
    const { friendRequests } = useFriends();
    const { hasNewMessage } = useConversations();

    return (
        <>
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
                            {hasNewMessage && <div className='w-3 h-3 bg-red-400 rounded-full' />}
                        </MenuItem>

                        <MenuItem url={NAVIGATION.FRIENDS.url}>
                            <div className='flex items-center gap-3 w-full'>
                                <MenuItemIcon icon={NAVIGATION.FRIENDS.icon} title={NAVIGATION.FRIENDS.title} />
                                {friendRequests.length > 0 && <div className='w-3 h-3 bg-red-400 rounded-full' />}
                            </div>
                        </MenuItem>

                        <MenuItem url={`${NAVIGATION.PROFILE.url}/${user.id}`}>
                            <MenuItemIcon icon={NAVIGATION.PROFILE.icon} title={NAVIGATION.PROFILE.title} />
                        </MenuItem>

                        <MenuItem onClick={openSearch}>
                            <MenuItemIcon icon={SearchIcon} title='Search' />
                        </MenuItem>

                        <MenuItem onClick={NAVIGATION.LOGOUT.onClick}>
                            <MenuItemIcon icon={NAVIGATION.LOGOUT.icon} title={NAVIGATION.LOGOUT.title} />
                        </MenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}