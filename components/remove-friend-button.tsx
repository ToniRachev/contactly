import { Button } from "@/components/ui/button";
import useFriendRequestAction from "@/hooks/useFriendRequestAction";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import clsx from "clsx";

type RemoveFriendButtonProps = {
    friendId: string;
    buttonVariant?: "default" | "destructive";
    className?: string;
}

export default function RemoveFriendButton({ friendId, buttonVariant = "default", className }: Readonly<RemoveFriendButtonProps>) {
    const { user } = useAuthenticatedUser();

    const { formAction, isPending } = useFriendRequestAction({
        type: 'remove',
        userId: user.id,
        friendId
    })

    return (
        <form className="w-full">
            <Button
                variant={buttonVariant}
                className={clsx("w-full", className)}
                formAction={formAction}
                disabled={isPending}
            >
                Remove friend
            </Button>
        </form>
    )
}