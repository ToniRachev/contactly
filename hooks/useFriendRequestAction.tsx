'use client';

import { acceptFriendRequest, deleteFriendRequest, sendFriendRequest } from "@/lib/actions/friendship/friendship.actions";
import { useActionState, useEffect } from "react";

type FriendRequestActionProps = {
    type: 'accept' | 'decline' | 'send';
    senderId: string;
    receiverId: string;
    onSuccess?: () => void;
}

export default function useFriendRequestAction({
    type,
    senderId,
    receiverId,
    onSuccess
}: Readonly<FriendRequestActionProps>) {
    const getHandler = () => {
        switch (type) {
            case 'accept':
                return acceptFriendRequest.bind(null, senderId, receiverId);
            case 'decline':
                return deleteFriendRequest.bind(null, senderId, receiverId);
            case 'send':
                return sendFriendRequest.bind(null, senderId, receiverId);
            default:
                throw new Error('Invalid type');
        }
    };

    const [state, formAction, isPending] = useActionState(getHandler(), {
        success: false,
        error: null,
    });

    useEffect(() => {
        if (state.success) {
            onSuccess?.();
        }
    }, [state, onSuccess]);

    return {
        formAction,
        isPending,
        state
    };
}