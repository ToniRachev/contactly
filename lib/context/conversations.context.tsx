'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuthenticatedUser } from "./user.context";
import { createClient } from "../utils/supabase/client";
import { BaseConversationOverviewDBType, BaseConversationOverviewType, ConversationOverviewType } from "../types/conversation";
import { transformBaseConversationOverview } from "../utils/transform";
import { getConversationOverview } from "../client/conversation.client";

type ConversationsContextType = {
    conversations: ConversationOverviewType[];
}

type ConversationsProviderProps = {
    children: React.ReactNode;
    initialConversations: ConversationOverviewType[];
}

const ConversationsContext = createContext<ConversationsContextType | null>(null);

export default function ConversationsProvider({ children, initialConversations }: Readonly<ConversationsProviderProps>) {
    const { user } = useAuthenticatedUser();
    const [conversations, setConversations] = useState<ConversationOverviewType[]>(initialConversations);

    const addConversation = useCallback(async (conversationId: string) => {
        const conversationOverview = await getConversationOverview(conversationId, user.id);
        setConversations((prevState) => [...prevState, conversationOverview]);
    }, [user.id])

    const updateConversation = useCallback((conversation: BaseConversationOverviewType) => {
        let shouldFetchNewConversationOverview = false;

        setConversations((prevState) => {
            const newState = [...prevState];

            const updatedConversation = newState.find((c) => c.id === conversation.id);

            if (updatedConversation) {
                updatedConversation.lastMessageId = conversation.lastMessageId;
                updatedConversation.lastMessagePreview = conversation.lastMessagePreview;
                updatedConversation.lastMessageAt = conversation.lastMessageAt;
                updatedConversation.unreadCount = conversation.unreadCount;
                return newState;
            }

            shouldFetchNewConversationOverview = true;
            return prevState;
        })

        if (shouldFetchNewConversationOverview) {
            addConversation(conversation.conversationId);
        }
    }, [])

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase.channel(`user-${user.id}-conversations`);

        channel.on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversation_overview',
            filter: `user_id=eq.${user.id}`,
        }, (payload) => {
            updateConversation(transformBaseConversationOverview(payload.new as BaseConversationOverviewDBType))
        })
            .subscribe();

        return () => {
            channel.unsubscribe();
        }
    }, [user.id, addConversation, updateConversation])

    const contextValue = useMemo(() => ({
        conversations: conversations.toSorted((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()),
    }), [conversations])

    return (
        <ConversationsContext.Provider value={contextValue}>
            {children}
        </ConversationsContext.Provider>
    )
}

export function useConversations() {
    const context = useContext(ConversationsContext);

    if (!context) {
        throw new Error('useConversations must be used within a ConversationsProvider');
    }

    return context;
}