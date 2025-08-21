'use client';

import UserProfileCard from "@/components/user-profile-card";
import EditProfile from "./edit-profile";
import { useFriends } from "@/lib/context/friends.context";
import FriendRequestButton from "@/components/friend-request-button";
import RemoveFriendButton from "@/components/remove-friend-button";

type UserDataProps = {
    fullName: string;
    avatarUrl: string | null;
    isOwnProfile: boolean;
    profileId: string;
}

export default function UserData({ fullName, avatarUrl, isOwnProfile, profileId }: Readonly<UserDataProps>) {
    const { friends } = useFriends();

    const areFriends = friends.some(friend => friend.id === profileId);

    return (
        <div className="flex justify-between w-full">
            <div className="flex items-center justify-between w-full">
                <UserProfileCard
                    name={fullName}
                    className="items-center flex-row"
                    avatar={avatarUrl}
                />

                {isOwnProfile && (
                    <EditProfile />
                )}

                {!areFriends && !isOwnProfile && (
                    <FriendRequestButton receiverId={profileId} />
                )}

                {areFriends && (
                    <div>
                        <RemoveFriendButton friendId={profileId} className="w-fit" buttonVariant="destructive" />
                    </div>
                )}
            </div>
        </div>
    )
}