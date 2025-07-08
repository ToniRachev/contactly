'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "./user.context";
import { createClient } from "../utils/supabase/client";
import { fetchUserProfile } from "../actions/user/user.actions";
import { UserType } from "@/lib/types/user";

type FriendsContextType = {
    friendRequests: UserType[];
}

const FriendsContext = createContext<FriendsContextType | null>(null);

type FriendsContextProviderProps = {
    children: React.ReactNode;
}

export default function FriendsContextProvider({ children }: Readonly<FriendsContextProviderProps>) {
    const { user } = useUser();
    const [friendRequests, setFriendRequests] = useState<UserType[]>([]);

    const handleAddFriendRequest = useCallback(async (senderId: string) => {
        const sender = await fetchUserProfile(senderId);

        setFriendRequests(prev => [...prev, sender]);
    }, [])

    useEffect(() => {
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
                        case 'UPDATE':
                            break;
                        case 'DELETE':
                            console.log('DELETE', payload);
                            break;
                    }
                }
            )
            .subscribe()


        return () => {
            channels.unsubscribe();
        }
    }, [user.id, handleAddFriendRequest])

    const contextValue: FriendsContextType = useMemo(() => ({
        friendRequests
    }), [friendRequests])

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