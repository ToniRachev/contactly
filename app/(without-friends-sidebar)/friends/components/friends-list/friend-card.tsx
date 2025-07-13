import { Button } from "@/components/ui/button";
import CardWrapper from "../card-wrapper";
import useFriendRequestAction from "@/hooks/useFriendRequestAction";
import { useAuthenticatedUser } from "@/lib/context/user.context";

type FriendCardProps = {
    friendAvatar: string | null;
    friendName: string;
    friendId: string;
}

export default function FriendCard({ friendAvatar, friendName, friendId }: Readonly<FriendCardProps>) {
    const { user } = useAuthenticatedUser();

    const { formAction, isPending } = useFriendRequestAction({
        type: 'remove',
        userId: user.id,
        friendId
    })

    return (
        <CardWrapper
            avatar={friendAvatar}
            name={friendName}
        >
            <>
                <Button variant="secondary" className="mr-2">
                    View profile
                </Button>

                <form className="w-full">
                    <Button
                        variant="destructive"
                        className="w-full"
                        formAction={formAction}
                        disabled={isPending}
                    >
                        Remove friend
                    </Button>
                </form>
            </>
        </CardWrapper>
    )
}