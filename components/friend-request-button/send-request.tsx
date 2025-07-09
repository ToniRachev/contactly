'use client';

import { useActionState, useEffect } from "react";
import { Button } from "../ui/button";
import { sendFriendRequest } from "@/lib/actions/friendship/friendship.actions";

type SendRequestProps = {
    senderId: string;
    receiverId: string;
    addSendRequest: (receiverId: string) => void;
}

export default function SendRequest({ senderId, receiverId, addSendRequest }: Readonly<SendRequestProps>) {
    const actionWrapper = sendFriendRequest.bind(null, senderId, receiverId);

    const [state, formAction, isPending] = useActionState(actionWrapper, {
        success: false,
        message: ''
    });

    useEffect(() => {
        if (state.success) {
            addSendRequest(receiverId);
        }
    }, [state, addSendRequest, receiverId])

    return (
        <form>
            <Button
                className="bg-stone-600 hover:bg-stone-500 min-w-[5vw]"
                formAction={formAction}
                disabled={isPending}
            >
                Add friend
            </Button>
        </form>
    )
}