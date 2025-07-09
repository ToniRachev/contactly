'use client';

import { useFriends } from "@/lib/context/friends.context";
import CancelRequest from "./cancel-request";
import SendRequest from "./send-request";
import { useUser } from "@/lib/context/user.context";

type FriendRequestButtonProps = {
    receiverId: string;
}

export default function FriendRequestButton({ receiverId }: Readonly<FriendRequestButtonProps>) {
    const { user } = useUser();
    const {
        sendRequests,
        addSendRequest,
        removeSendRequest
    } = useFriends();

    const isFriendRequestSent = sendRequests.includes(receiverId);

    if (isFriendRequestSent) {
        return <CancelRequest senderId={user.id} receiverId={receiverId} removeSendRequest={removeSendRequest} />
    }

    return <SendRequest senderId={user.id} receiverId={receiverId} addSendRequest={addSendRequest} />
}