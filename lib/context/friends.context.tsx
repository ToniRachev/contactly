'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "./user.context";
import { createClient } from "../utils/supabase/client";
import { fetchUserProfile } from "../actions/user/user.actions";
import { BaseUserType } from "../types/post";

type FriendsContextType = {
    friends: BaseUserType[];
    friendRequests: BaseUserType[];
    sendRequests: string[];
    addSendRequest: (receiverId: string) => void;
    removeSendRequest: (receiverId: string) => void;
}

const FriendsContext = createContext<FriendsContextType | null>(null);

type FriendsContextProviderProps = {
    friendSendRequests: string[];
    initialFriendRequests: BaseUserType[];
    initialFriends: BaseUserType[];
    children: React.ReactNode;
}

export default function FriendsContextProvider({ children, friendSendRequests, initialFriendRequests, initialFriends }: Readonly<FriendsContextProviderProps>) {
    const { user, isAuthenticated } = useUser();

    const [friendRequests, setFriendRequests] = useState<BaseUserType[]>(initialFriendRequests);
    const [sendRequests, setSendRequests] = useState<string[]>(friendSendRequests);

    const [friends, setFriends] = useState<BaseUserType[]>(initialFriends);

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

    const handleAddFriend = useCallback(async (friendId: string) => {
        const friend = await fetchUserProfile(friendId);

        setFriends(prev => [...prev, friend]);
    }, [setFriends])

    const handleRemoveFriend = useCallback((friendId: string) => {
        setFriends(prev => prev.filter(friend => friend.id !== friendId));
    }, [setFriends])

    useEffect(() => {
        if (!isAuthenticated) return;
        const supabase = createClient();

        const receiveChannel = supabase.channel('receive-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'friend_requests',
                    filter: `receiver_id=eq.${user?.id}`
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
                    filter: `receiver_id=eq.${user?.id}`
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
                    event: 'DELETE',
                    schema: 'public',
                    table: 'friend_requests',
                    filter: `sender_id=eq.${user?.id}`
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
    }, [user, isAuthenticated, handleAddFriendRequest, handleRemoveFriendRequest, handleAddSendRequest, handleRemoveSendRequest])

    useEffect(() => {
        if (!isAuthenticated) return;
        const supabase = createClient();

        const friendsChannel = supabase.channel('friends-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'friends',
                    filter: `user_id=eq.${user?.id}`
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
                    filter: `user_id=eq.${user?.id}`
                },
                (payload) => {
                    handleRemoveFriend(payload.old.friend_id);
                }
            )
            .subscribe();

        return () => {
            friendsChannel.unsubscribe();
        }
    }, [user, isAuthenticated, handleAddFriend, handleRemoveFriend])

    const contextValue: FriendsContextType = useMemo(() => ({
        friends,
        friendRequests,
        sendRequests,
        addSendRequest: handleAddSendRequest,
        removeSendRequest: handleRemoveSendRequest
    }), [friendRequests, sendRequests, handleAddSendRequest, handleRemoveSendRequest, friends])

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