'use client';

import { useCallback, useEffect, useState } from "react";
import { ConversationType, MessageDBType, MessageType } from "@/lib/types/conversation";
import { createOrFindConversation } from "@/lib/client/message.client";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { transformMessage } from "@/lib/utils/transform";
import { createClient } from "@/lib/utils/supabase/client";
import { useFriends } from "@/lib/context/friends.context";

export default function useMessage(activeConversationUserId: string | null) {
    const { user } = useAuthenticatedUser();
    const { friends } = useFriends();
    const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);

    const [loading, setLoading] = useState(false);

    const fetchInitialData = useCallback(async () => {
        if (!activeConversationUserId) return;

        setLoading(true);

        const conversation = await createOrFindConversation([user.id, activeConversationUserId])

        const activeConversationUser = friends.find((friend) => friend.id === activeConversationUserId);

        if (!activeConversationUser) return;

        setActiveConversation(conversation);

        setLoading(false);
    }, [activeConversationUserId, user.id, setActiveConversation, friends])

    const handleIncomingMessage = useCallback((message: MessageDBType) => {
        const newMessage = transformMessage(message);

        setActiveConversation((prevState) => {
            if (!prevState) return prevState;

            return {
                ...prevState,
                messages: [...prevState.messages, newMessage]
            }
        })
    }, [])

    const addLocalMessage = useCallback((message: MessageType) => {
        setActiveConversation((prevState) => {
            if (!prevState) return prevState;

            return {
                ...prevState,
                messages: [...prevState.messages, message]
            }
        })
    }, [])

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData, activeConversationUserId])

    useEffect(() => {
        if (!activeConversation?.id) return;

        const supabase = createClient();

        const channel = supabase
            .channel(`conversation:${activeConversation.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConversation.id}`,
            }, (payload) => {
                if (payload.new.sender_id !== user.id) {
                    handleIncomingMessage(payload.new as MessageDBType);
                }
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        }
    }, [activeConversation?.id, handleIncomingMessage, user.id])

    return {
        activeConversation,
        loading,
        addLocalMessage,
    }
}