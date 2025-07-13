'use client';

import { Button } from "../ui/button";
import useFriendRequestAction from "@/hooks/useFriendRequestAction";

type CancelRequestProps = {
    senderId: string;
    receiverId: string;
    removeSendRequest: (receiverId: string) => void;
}

export default function CancelRequest({ senderId, receiverId, removeSendRequest }: Readonly<CancelRequestProps>) {
    const { formAction, isPending } = useFriendRequestAction({
        type: 'decline',
        senderId,
        receiverId,
        onSuccess: () => removeSendRequest(receiverId),
    });

    return (
        <form>
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