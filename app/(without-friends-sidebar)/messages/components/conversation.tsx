'use client';

import { useMessageContext } from "@/lib/context/message.context";
import { ConversationType, MessageType } from "@/lib/types/conversation";
import { useOptimistic } from "react";
import SendMessage from "./send-message";
import useMessage from "@/hooks/useMessage";
import ActiveConversationUserCard from "./active-conversation-user-card";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import MessageList from "./message-list";
import useMarkConversationRead from "../hooks/useMarkConversationRead";

export default function Conversation() {
    const { user } = useAuthenticatedUser();
    const { activeConversationUserId } = useMessageContext();
    const { activeConversation, loading, addLocalMessage } = useMessage(activeConversationUserId);

    useMarkConversationRead(activeConversation, user.id);

    const recipient = activeConversation?.participants.find((participant) => participant.userId !== user.id);

    const [optimisticConversation, addOptimisticMessage] = useOptimistic(
        activeConversation,
        (state: ConversationType | null, newMessage: MessageType) => {
            if (!state) return state;

            return {
                ...state,
                messages: [...state.messages, newMessage]
            }
        }
    )

    if (loading || !activeConversation) {
        return <div>Loading...</div>
    }

    return (
        <div className="w-full">
            <ActiveConversationUserCard />
            <MessageList
                conversation={optimisticConversation}
                recipient={recipient}
            />
            <SendMessage
                addOptimisticMessage={addOptimisticMessage}
                conversationId={activeConversation.id}
                addLocalMessage={addLocalMessage}
            />
        </div >
    )
}