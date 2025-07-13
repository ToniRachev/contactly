'use client';

import { Button } from "../ui/button";
import useFriendRequestAction from "@/hooks/useFriendRequestAction";

type SendRequestProps = {
    senderId: string;
    receiverId: string;
    addSendRequest: (receiverId: string) => void;
}

export default function SendRequest({ senderId, receiverId, addSendRequest }: Readonly<SendRequestProps>) {
    const { formAction, isPending } = useFriendRequestAction({
        type: 'send',
        userId: senderId,
        friendId: receiverId,
        onSuccess: () => addSendRequest(receiverId),
    });

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