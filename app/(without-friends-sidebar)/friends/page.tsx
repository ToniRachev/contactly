import { Button } from "@/components/ui/button";
import CardWrapper from "./components/card-wrapper";
import SectionWrapper from "./components/section-wrapper";
import FriendRequests from "./components/friend-requests";

const friends = [
    {
        friendId: '1',
        friendAvatar: '/user_avatar_2.png',
        friendName: 'Traveler Jane'
    },
    {
        friendId: '2',
        friendAvatar: '/user_avatar_3.png',
        friendName: 'Elias Monroe'
    }
]

type CardProps = {
    friendAvatar: string;
    friendName: string;
}

const FriendCard = ({ friendAvatar, friendName }: Readonly<CardProps>) => {
    return (
        <CardWrapper
            avatar={friendAvatar}
            name={friendName}
        >
            <>
                <Button variant="secondary" className="mr-2">
                    View profile
                </Button>
                <Button variant="destructive">
                    Remove friend
                </Button>
            </>
        </CardWrapper>
    )
}

const FriendsList = () => {
    return (
        <div>
            <div className="flex justify-between">
                <h6 className="pb-2">Friends</h6>
                <p>{friends.length} friends</p>
            </div>

            <SectionWrapper>
                {friends.map((friend) => (
                    <FriendCard key={friend.friendId} {...friend} />
                ))}
            </SectionWrapper>
        </div>
    )
}

export default function Friends() {
    return (
        <div className="flex flex-col gap-8">
            <FriendRequests />
            <FriendsList />
        </div>
    )
}