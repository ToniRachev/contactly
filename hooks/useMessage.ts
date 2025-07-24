'use client';

import { useCallback, useEffect, useState } from "react";
import { ConversationParticipantDBType, ConversationParticipantType, ConversationType, MessageDBType, MessageType } from "@/lib/types/conversation";
import { createOrFindConversation } from "@/lib/client/message.client";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { transformConversationParticipant, transformMessage } from "@/lib/utils/transform";
import { createClient } from "@/lib/utils/supabase/client";
import { useFriends } from "@/lib/context/friends.context";

function useConversationParticipantsSubscription(conversationId: string | undefined, handleUpdateReadMessage: (newState: ConversationParticipantType) => void) {

    useEffect(() => {
        const supabase = createClient();

        if (!conversationId) return;

        const channel = supabase.channel(`conversation-participants:${conversationId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'conversation_participants',
                filter: `conversation_id=eq.${conversationId}`,
            }, (payload) => {
                handleUpdateReadMessage(transformConversationParticipant(payload.new as ConversationParticipantDBType));
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        }
    }, [conversationId, handleUpdateReadMessage])
}

function useMessagesSubscription(activeConversationId: string | undefined, handleIncomingMessage: (message: MessageDBType) => void) {
    const { user } = useAuthenticatedUser();

    useEffect(() => {
        if (!activeConversationId) return;

        const supabase = createClient();

        const channel = supabase
            .channel(`conversation:${activeConversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConversationId}`,
            }, (payload) => {
                if (payload.new.sender_id !== user.id) {
                    handleIncomingMessage(payload.new as MessageDBType);
                }
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        }
    }, [activeConversationId, user.id, handleIncomingMessage])
}

export default function useMessage(activeConversationUserId: string | null) {
    const { user } = useAuthenticatedUser();
    const { friends } = useFriends();
    const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);

    const [loading, setLoading] = useState(false);

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

    const handleUpdateReadMessage = useCallback((newState: ConversationParticipantType) => {
        setActiveConversation((prevState) => {
            if (!prevState) return prevState;

            const participants = [...prevState.participants].map((participant) => {
                if (participant.userId === newState.userId) {
                    return newState;
                }

                return participant;
            })

            return {
                ...prevState,
                participants,
            }
        })
    }, [setActiveConversation])

    useMessagesSubscription(activeConversation?.id, handleIncomingMessage);
    useConversationParticipantsSubscription(activeConversation?.id, handleUpdateReadMessage);

    const fetchInitialData = useCallback(async () => {
        if (!activeConversationUserId) return;

        setLoading(true);

        const conversation = await createOrFindConversation([user.id, activeConversationUserId])

        const activeConversationUser = friends.find((friend) => friend.id === activeConversationUserId);

        if (!activeConversationUser) return;

        setActiveConversation(conversation);

        setLoading(false);
    }, [activeConversationUserId, user.id, setActiveConversation, friends])

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

    return {
        activeConversation,
        loading,
        addLocalMessage,
    }
}