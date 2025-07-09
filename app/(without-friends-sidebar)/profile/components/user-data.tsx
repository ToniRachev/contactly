'use client';

import UserProfileCard from "@/components/user-profile-card";
import { useAuthenticatedUser } from "@/lib/context/user.context";

export default function UserData() {
    const { user } = useAuthenticatedUser();

    return (
        <div>
            <UserProfileCard
                name={user.fullName}
                className="items-start"
                avatar={user.avatarUrl}
            />
            {user.biography.currentCity && (
                <p className="">From {user.biography.currentCity}</p>
            )}
        </div>
    )
}