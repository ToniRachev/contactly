'use client';

import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import useFriendRequestAction from "@/hooks/useFriendRequestAction";

type PendingFriendRequestProps = {
    receiverId: string;
}

export default function PendingFriendRequest({ receiverId }: Readonly<PendingFriendRequestProps>) {
    const { user } = useAuthenticatedUser();

    const { formAction: declineFormAction, isPending: isDeclinePending } = useFriendRequestAction({
        type: 'decline',
        senderId: receiverId,
        receiverId: user.id
    })

    const { formAction: acceptFormAction, isPending: isAcceptPending } = useFriendRequestAction({
        type: 'accept',
        senderId: receiverId,
        receiverId: user.id
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="">Pending friend request</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='start'
            >
                <DropdownMenuItem className="cursor-pointer">
                    <form>
                        <button formAction={acceptFormAction} disabled={isAcceptPending}>
                            Accept request
                        </button>
                    </form>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <form>
                        <button formAction={declineFormAction} disabled={isDeclinePending}>
                            Decline request
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}