'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "./user.context";
import { createClient } from "../utils/supabase/client";
import { fetchUserProfile } from "../actions/user/user.actions";
import { BaseUserType } from "../types/post";

type FriendsContextType = {
    friendRequests: BaseUserType[];
    sendRequests: string[];
    addSendRequest: (receiverId: string) => void;
    removeSendRequest: (receiverId: string) => void;
}

const FriendsContext = createContext<FriendsContextType | null>(null);

type FriendsContextProviderProps = {
    friendSendRequests: string[];
    initialFriendRequests: BaseUserType[];
    children: React.ReactNode;
}

export default function FriendsContextProvider({ children, friendSendRequests, initialFriendRequests }: Readonly<FriendsContextProviderProps>) {
    const { user, isAuthenticated } = useUser();

    const [friendRequests, setFriendRequests] = useState<BaseUserType[]>(initialFriendRequests);
    const [sendRequests, setSendRequests] = useState<string[]>(friendSendRequests);

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
        if (!isAuthenticated) return;
        const supabase = createClient();

        const channels = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'friend_requests',
                    filter: `receiver_id=eq.${user?.id}`
                },
                (payload) => {
                    switch (payload.eventType) {
                        case 'INSERT': {
                            handleAddFriendRequest(payload.new.sender_id);
                            break;
                        }
                        case 'DELETE':
                            handleRemoveFriendRequest(payload.old.sender_id);
                            break;
                    }
                }
            )
            .subscribe()


        return () => {
            channels.unsubscribe();
        }
    }, [user, isAuthenticated, handleAddFriendRequest, handleRemoveFriendRequest])

    const contextValue: FriendsContextType = useMemo(() => ({
        friendRequests,
        sendRequests,
        addSendRequest: handleAddSendRequest,
        removeSendRequest: handleRemoveSendRequest
    }), [friendRequests, sendRequests, handleAddSendRequest, handleRemoveSendRequest])

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