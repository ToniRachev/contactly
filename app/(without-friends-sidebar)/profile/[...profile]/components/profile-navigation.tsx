'use client';

import { NAVIGATION } from "@/lib/constants/navigation";
import { buildProfilePhotosUrl } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";


type ProfileNavigationItemProps = {
    label: string;
    href: string;
    isActive: boolean;
}

const ProfileNavigationItem = ({ label, href, isActive }: Readonly<ProfileNavigationItemProps>) => {
    return (
        <li>
            <Link href={href}>
                <span className={clsx('p-2 rounded-lg', isActive ? 'bg-surface' : 'hover:bg-surface/70 text-stone-300')}>
                    {label}
                </span>
            </Link>
        </li>
    )
}

type ProfileNavigationProps = {
    profileId: string;
}

const isActive = (href: string, pathname: string) => pathname.endsWith(href);

export default function ProfileNavigation({ profileId }: Readonly<ProfileNavigationProps>) {
    const pathname = usePathname();

    const navigationItems = useMemo(() => [
        {
            label: 'Posts',
            href: `${NAVIGATION.PROFILE.url}/${profileId}`,
        },
        {
            label: 'Photos',
            href: buildProfilePhotosUrl(profileId),
        },
    ], [profileId])


    return (
        <ul className="flex border-t py-4 space-x-2">
            {navigationItems.map((item) => (
                <ProfileNavigationItem key={item.href} label={item.label} href={item.href} isActive={isActive(item.href, pathname)} />
            ))}
        </ul>
    )
}