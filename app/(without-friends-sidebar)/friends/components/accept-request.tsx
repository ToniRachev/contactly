'use client';

import { Button } from "@/components/ui/button";
import useFriendRequestAction from "@/hooks/useFriendRequestAction";
import { useAuthenticatedUser } from "@/lib/context/user.context";

type AcceptRequestProps = {
    senderId: string;
}

export default function AcceptRequest({ senderId }: Readonly<AcceptRequestProps>) {
    const { user } = useAuthenticatedUser();

    const { formAction, isPending } = useFriendRequestAction({
        type: 'accept',
        senderId,
        receiverId: user.id
    })

    return (
        <form className="w-full">
            <Button
                variant="secondary"
                className="w-full"
                formAction={formAction}
                disabled={isPending}
            >
                Accept
            </Button>
        </form>
    )
}