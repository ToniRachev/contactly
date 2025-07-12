'use client';

import { Button } from "@/components/ui/button";
import CardWrapper from "./card-wrapper";
import SectionWrapper from "./section-wrapper";
import { useFriends } from "@/lib/context/friends.context";

type FriendRequestsProps = {
    friendAvatar: string | null;
    friendName: string;
}

const CardRequest = ({ friendAvatar, friendName }: Readonly<FriendRequestsProps>) => {
    return (
        <CardWrapper
            avatar={friendAvatar}
            name={friendName}
        >
            <>
                <Button variant="secondary" className="mr-2">
                    Accept
                </Button>
                <Button variant="destructive">
                    Decline
                </Button>
            </>
        </CardWrapper>
    )
}


export default function FriendRequests() {
    const { friendRequests } = useFriends();

    return (
        <div>
            <h6 className="pb-2">Friend requests</h6>

            <SectionWrapper>
                {friendRequests.map((request) => (
                    <CardRequest key={request.id} friendAvatar={request.avatarUrl} friendName={request.fullName} />
                ))}
            </SectionWrapper>
        </div>
    )
}