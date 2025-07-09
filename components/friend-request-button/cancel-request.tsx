'use client';

import { cancelFriendRequest } from "@/lib/actions/friendship/friendship.actions";
import { Button } from "../ui/button";
import { useActionState, useEffect } from "react";

type CancelRequestProps = {
    senderId: string;
    receiverId: string;
    removeSendRequest: (receiverId: string) => void;
}

export default function CancelRequest({ senderId, receiverId, removeSendRequest }: Readonly<CancelRequestProps>) {
    const actionWrapper = cancelFriendRequest.bind(null, senderId, receiverId);

    const [state, formAction, isPending] = useActionState(actionWrapper, {
        success: false,
        message: ''
    });

    useEffect(() => {
        if (state.success) {
            removeSendRequest(receiverId);
        }
    }, [state, removeSendRequest, receiverId])

    return (
        <form >
            <Button
                variant={'destructive'}
                formAction={formAction}
                disabled={isPending}
            >
                Cancel request
            </Button>
        </form>
    )
}   