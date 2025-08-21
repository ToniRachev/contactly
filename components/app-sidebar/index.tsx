'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react';
import DefaultSidebarContent from './components/default-sidebar-content';
import SearchSidebarContent from './components/search-sidebar';

type MenuItemProps = {
    children: React.ReactNode
    url?: string
    onClick?: () => void
}

type MenuItemIconProps = {
    icon: LucideIcon
    title: string
}

export const MenuItemIcon = ({ icon, title }: MenuItemIconProps) => {
    const Icon = icon;
    return (
        <div className='flex items-center gap-2'>
            <Icon />
            <span>{title}</span>
        </div>
    )
}

export const MenuItem = ({ children, url, onClick }: MenuItemProps) => {
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
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <Sidebar className='!border-0'>
            <SidebarHeader className='pb-12 pt-8'>
                <Link href={'/'}>
                    <h5>Connectly</h5>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {isSearchOpen ? (
                    <SearchSidebarContent closeSearch={() => setIsSearchOpen(false)} />
                ) : (
                    <DefaultSidebarContent openSearch={() => setIsSearchOpen(true)} />
                )}
            </SidebarContent>
        </Sidebar>
    )
}