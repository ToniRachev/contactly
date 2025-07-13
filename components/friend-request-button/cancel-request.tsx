'use client';

import { Button } from "../ui/button";
import useFriendRequestAction from "@/hooks/useFriendRequestAction";

type CancelRequestProps = {
    senderId: string;
    receiverId: string;
}

export default function CancelRequest({ senderId, receiverId }: Readonly<CancelRequestProps>) {
    const { formAction, isPending } = useFriendRequestAction({
        type: 'decline',
        userId: senderId,
        friendId: receiverId,
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