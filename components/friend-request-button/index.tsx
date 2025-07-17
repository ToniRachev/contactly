'use client';

import { useFriends } from "@/lib/context/friends.context";
import CancelRequest from "./cancel-request";
import SendRequest from "./send-request";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import PendingFriendRequest from "./pending-friend-request";

type FriendRequestButtonProps = {
    receiverId: string;
}

export default function FriendRequestButton({ receiverId }: Readonly<FriendRequestButtonProps>) {
    const { user } = useAuthenticatedUser();
    const {
        sendRequests,
        friendRequests
    } = useFriends();

    const hasFriendRequest = friendRequests.some(request => request.id === receiverId);

    if (hasFriendRequest) {
        return <PendingFriendRequest receiverId={receiverId} />
    }

    const isFriendRequestSent = sendRequests.includes(receiverId);

    if (isFriendRequestSent) {
        return <CancelRequest senderId={user.id} receiverId={receiverId} />
    }

    return <SendRequest senderId={user.id} receiverId={receiverId} />
}