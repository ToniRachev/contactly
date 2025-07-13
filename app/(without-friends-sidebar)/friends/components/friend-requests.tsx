'use client';

import CardWrapper from "./card-wrapper";
import SectionWrapper from "./section-wrapper";
import { useFriends } from "@/lib/context/friends.context";
import AcceptRequest from "./accept-request";
import DeclineRequest from "./decline-request";

type FriendRequestsProps = {
    friendAvatar: string | null;
    friendName: string;
    senderId: string;
}

const CardRequest = ({ friendAvatar, friendName, senderId }: Readonly<FriendRequestsProps>) => {
    return (
        <CardWrapper
            avatar={friendAvatar}
            name={friendName}
        >
            <>
                <AcceptRequest senderId={senderId} />
                <DeclineRequest senderId={senderId} />
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
                    <CardRequest
                        key={request.id}
                        friendAvatar={request.avatarUrl}
                        friendName={request.fullName}
                        senderId={request.id}
                    />
                ))}
            </SectionWrapper>
        </div>
    )
}