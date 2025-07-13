'use client';

import { Button } from "@/components/ui/button";
import { deleteFriendRequest } from "@/lib/actions/friendship/friendship.actions";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { useActionState } from "react";

type DeclineRequestProps = {
    senderId: string;
}

export default function DeclineRequest({ senderId }: Readonly<DeclineRequestProps>) {
    const { user } = useAuthenticatedUser();
    const formActionWrapper = deleteFriendRequest.bind(null, senderId, user.id);
    const [, formAction, isPending] = useActionState(formActionWrapper, {
        success: false,
        error: null,
    })

    return (
        <form className="w-full">
            <Button
                className="w-full"
                variant="destructive"
                disabled={isPending}
                formAction={formAction}
            >
                Decline
            </Button>
        </form>
    )
}