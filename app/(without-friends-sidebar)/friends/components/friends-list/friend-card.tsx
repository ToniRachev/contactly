import { Button } from "@/components/ui/button";
import CardWrapper from "../card-wrapper";
import RemoveFriendButton from "@/components/remove-friend-button";

type FriendCardProps = {
    friendAvatar: string | null;
    friendName: string;
    friendId: string;
}

export default function FriendCard({ friendAvatar, friendName, friendId }: Readonly<FriendCardProps>) {

    return (
        <CardWrapper
            avatar={friendAvatar}
            name={friendName}
        >
            <>
                <Button variant="secondary" className="mr-2">
                    View profile
                </Button>

                <RemoveFriendButton friendId={friendId} buttonVariant="destructive" />
            </>
        </CardWrapper>
    )
}