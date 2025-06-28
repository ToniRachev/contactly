import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ReactNode } from "react";

const requests = [
    {
        friendId: '1',
        friendAvatar: '/user_avatar_2.png',
        friendName: 'Traveler Jane'
    },
    {
        friendId: '2',
        friendAvatar: '/user_avatar_3.png',
        friendName: 'Elias Monroe'
    },
    {
        friendId: '3',
        friendAvatar: '/user_avatar_4.png',
        friendName: 'Maya Sinclair'
    },
    {
        friendId: '4',
        friendAvatar: '/user_avatar_4.png',
        friendName: 'Maya Sinclair'
    },
    {
        friendId: '5',
        friendAvatar: '/user_avatar_4.png',
        friendName: 'Maya Sinclair'
    },
    {
        friendId: '6',
        friendAvatar: '/user_avatar_4.png',
        friendName: 'Maya Sinclair'
    }
]

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

type CardWrapperProps = {
    avatar: string;
    name: string;
    children: ReactNode
}

const SectionWrapper = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <ul className="grid grid-cols-5 gap-4">
            {children}
        </ul>
    )
}

const CardWrapper = ({ avatar, name, children }: Readonly<CardWrapperProps>) => {
    return (
        <li className="rounded-md border border-stone-600 overflow-hidden">
            <div>
                <Image src={avatar} alt='Friend avatar' width={350} height={350} className="rounded-t-md" />
            </div>

            <div className="py-4 px-2">
                <h6>{name}</h6>

                <div className="pt-4">
                    {children}
                </div>
            </div>
        </li>
    )
}

const RequestCard = ({ friendAvatar, friendName }: Readonly<CardProps>) => {
    return (
        <CardWrapper
            avatar={friendAvatar}
            name={friendName}
        >
            <>
                <Button variant="secondary" className="mr-2">
                    Accept
                </Button>
                <Button variant="destructive">
                    Decline
                </Button>
            </>
        </CardWrapper>
    )
}

const FriendRequests = () => {
    return (
        <div>
            <h6 className="pb-2">Friend requests</h6>

            <SectionWrapper>
                {requests.map((request) => (
                    <RequestCard key={request.friendId} {...request} />
                ))}
            </SectionWrapper>
        </div>
    )
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