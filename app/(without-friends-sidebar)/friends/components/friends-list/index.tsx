'use client';

import { useFriends } from "@/lib/context/friends.context";
import SectionWrapper from "../section-wrapper";
import FriendCard from "./friend-card";

export default function FriendsList() {
    const { friends } = useFriends();

    return (
        <div>
            <div className="flex justify-between">
                <h6 className="pb-2">Friends</h6>
                <p>{friends.length} friends</p>
            </div>

            <SectionWrapper>
                {friends.map((friend) => (
                    <FriendCard
                        key={friend.id}
                        friendAvatar={friend.avatarUrl}
                        friendName={friend.fullName}
                        friendId={friend.id}
                    />
                ))}
            </SectionWrapper>
        </div>
    )
}