'use client';

import { acceptFriendRequest, deleteFriendRequest, removeFriend, sendFriendRequest } from "@/lib/actions/friendship/friendship.actions";
import { useActionState, useEffect } from "react";

type FriendRequestActionProps = {
    type: 'accept' | 'decline' | 'send' | 'remove';
    userId: string;
    friendId: string;
    onSuccess?: () => void;
}

export default function useFriendRequestAction({
    type,
    userId,
    friendId,
    onSuccess
}: Readonly<FriendRequestActionProps>) {
    const getHandler = () => {
        switch (type) {
            case 'accept':
                return acceptFriendRequest.bind(null, userId, friendId);
            case 'decline':
                return deleteFriendRequest.bind(null, userId, friendId);
            case 'send':
                return sendFriendRequest.bind(null, userId, friendId);
            case 'remove':
                return removeFriend.bind(null, userId, friendId);
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