'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuthenticatedUser } from "./user.context";
import { createClient } from "../utils/supabase/client";
import { fetchUserProfile } from "../actions/user/user.actions";
import { BaseUserType, PresenceStatusType, UserWithPresenceStatusType } from "../types/user";

type FriendsContextType = {
    friends: UserWithPresenceStatusType[];
    friendRequests: BaseUserType[];
    sendRequests: string[];
}

function useFriendRequestSubscription(
    initialFriendRequests: BaseUserType[],
    initialSendRequests: string[],
    userId: string
) {
    const [friendRequests, setFriendRequests] = useState<BaseUserType[]>(initialFriendRequests);
    const [sendRequests, setSendRequests] = useState<string[]>(initialSendRequests);

    const handleAddFriendRequest = useCallback(async (senderId: string) => {
        const sender = await fetchUserProfile(senderId);

        setFriendRequests(prev => [...prev, sender]);
    }, [setFriendRequests])

    const handleRemoveFriendRequest = useCallback(async (senderId: string) => {
        setFriendRequests(prev => prev.filter(request => request.id !== senderId));
    }, [setFriendRequests])


    const handleAddSendRequest = useCallback(async (receiverId: string) => {
        setSendRequests(prev => [...prev, receiverId]);
    }, [setSendRequests])

    const handleRemoveSendRequest = useCallback(async (receiverId: string) => {
        setSendRequests(prev => prev.filter(id => id !== receiverId));
    }, [setSendRequests])


    useEffect(() => {
        const supabase = createClient();

        const receiveChannel = supabase.channel('receive-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'friend_requests',
                    filter: `receiver_id=eq.${userId}`
                },
                (payload) => {
                    handleAddFriendRequest(payload.new.sender_id);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'friend_requests',
                    filter: `receiver_id=eq.${userId}`
                },
                (payload) => {
                    handleRemoveFriendRequest(payload.old.sender_id);
                }
            )
            .subscribe();

        const sendChannel = supabase.channel('send-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'friend_requests',
                    filter: `sender_id=eq.${userId}`
                },
                (payload) => {
                    handleAddSendRequest(payload.new.receiver_id);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'friend_requests',
                    filter: `sender_id=eq.${userId}`
                },
                (payload) => {
                    handleRemoveSendRequest(payload.old.receiver_id);
                }
            )
            .subscribe();

        return () => {
            receiveChannel.unsubscribe();
            sendChannel.unsubscribe();
        }
    }, [handleAddFriendRequest, handleRemoveFriendRequest, handleAddSendRequest, handleRemoveSendRequest, userId])

    return {
        friendRequests,
        sendRequests,
    }
}

function useFriendSubscription(initialFriends: UserWithPresenceStatusType[], userId: string) {
    const [friends, setFriends] = useState<UserWithPresenceStatusType[]>(initialFriends);

    const handleAddFriend = useCallback(async (friendId: string) => {
        const friend = await fetchUserProfile(friendId);

        setFriends(prev => [...prev, friend]);
    }, [setFriends])

    const handleRemoveFriend = useCallback((friendId: string) => {
        setFriends(prev => prev.filter(friend => friend.id !== friendId));
    }, [setFriends])

    useEffect(() => {
        const supabase = createClient();

        const friendsChannel = supabase.channel('friends-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'friends',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    handleAddFriend(payload.new.friend_id);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'friends',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    handleRemoveFriend(payload.old.friend_id);
                }
            )
            .subscribe();

        return () => {
            friendsChannel.unsubscribe();
        }
    }, [handleAddFriend, handleRemoveFriend, userId])

    return {
        friends,
        setFriends
    }
}

function useFriendPresenceSubscription(
    userId: string,
    friendsIds: string[],
    handleUpdateFriendPresenceStatus: (friendId: string, presenceStatus: PresenceStatusType, lastSeen: Date) => void) {
    useEffect(() => {
        const supabase = createClient();

        const presenceChannel = supabase.channel('presence-channel')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'users',
                filter: `id=in.(${friendsIds.join(', ')})`
            },
                (payload) => {
                    handleUpdateFriendPresenceStatus(payload.new.id, payload.new.presence_status, payload.new.last_seen);
                })
            .subscribe();

        return () => {
            presenceChannel.unsubscribe();
        }
    }, [userId, friendsIds, handleUpdateFriendPresenceStatus])
}

const FriendsContext = createContext<FriendsContextType | null>(null);

type FriendsContextProviderProps = {
    friendSendRequests: string[];
    initialFriendRequests: BaseUserType[];
    initialFriends: UserWithPresenceStatusType[];
    children: React.ReactNode;
}

export default function FriendsContextProvider({ children, friendSendRequests, initialFriendRequests, initialFriends }: Readonly<FriendsContextProviderProps>) {
    const { user } = useAuthenticatedUser();

    const { friendRequests, sendRequests } = useFriendRequestSubscription(initialFriendRequests, friendSendRequests, user.id);
    const { friends, setFriends } = useFriendSubscription(initialFriends, user.id);

    const handleUpdateFriendPresenceStatus = useCallback((friendId: string, presenceStatus: PresenceStatusType, lastSeen: Date) => {
        setFriends((prevState) => {
            const friendIndex = prevState.findIndex(friend => friend.id === friendId);
            if (friendIndex === -1) return prevState;

            const friend = { ...prevState[friendIndex] };
            friend.presenceStatus = presenceStatus;
            friend.lastSeen = lastSeen;

            return [...prevState.slice(0, friendIndex), friend, ...prevState.slice(friendIndex + 1)];
        })
    }, [setFriends])

    useFriendPresenceSubscription(user.id, friends.map(friend => friend.id), handleUpdateFriendPresenceStatus);


    const contextValue: FriendsContextType = useMemo(() => ({
        friends,
        friendRequests,
        sendRequests,
    }), [friendRequests, sendRequests, friends])

    return (
        <FriendsContext.Provider value={contextValue}>
            {children}
        </FriendsContext.Provider>
    )
}

export function useFriends() {
    const context = useContext(FriendsContext);
    if (!context) {
        throw new Error('useFriends must be used within a FriendsContextProvider');
    }
    return context;
}