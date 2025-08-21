import { Button } from "@/components/ui/button";
import CardWrapper from "../card-wrapper";
import RemoveFriendButton from "@/components/remove-friend-button";
import Link from "next/link";
import { NAVIGATION } from "@/lib/constants/navigation";

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
                <Link href={`${NAVIGATION.PROFILE.url}/${friendId}`} className="w-full">
                    <Button variant="secondary" className="mr-2 w-full">
                        View profile
                    </Button>
                </Link>

                <RemoveFriendButton friendId={friendId} buttonVariant="destructive" />
            </>
        </CardWrapper>
    )
}