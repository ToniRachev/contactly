'use client';

import { useConversationContext } from "@/lib/context/conversation.context";
import { ConversationType, MessageType } from "@/lib/types/conversation";
import { useOptimistic } from "react";
import SendMessage from "./send-message";
import useConversation from "@/hooks/useConversation";
import ActiveConversationUserCard from "./active-conversation-user-card";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import MessageList from "./message-list";
import useMarkConversationRead from "../hooks/useMarkConversationRead";
import { Inbox } from "lucide-react";
import ConversationSkeleton from "./conversation-skeleton";

export default function Conversation() {
    const { user } = useAuthenticatedUser();
    const { activeConversationUserId } = useConversationContext();
    const { conversation, loading, addLocalMessage, conversationParticipant } = useConversation(activeConversationUserId);

    useMarkConversationRead(conversation, user.id);

    const recipient = conversation?.participants.find((participant) => participant.userId !== user.id);

    const [optimisticConversation, addOptimisticMessage] = useOptimistic(
        conversation,
        (state: ConversationType | null, newMessage: MessageType) => {
            if (!state) return state;

            return {
                ...state,
                messages: [...state.messages, newMessage]
            }
        }
    )

    if (loading) {
        return <ConversationSkeleton />
    }

    if (!conversation) {
        return (
            <div className="absolute top-1/2 left-1/2 flex flex-col items-center gap-4">
                <Inbox className="w-10 h-10" />
                <h6 className="text-2xl font-bold">Nothing here yet—choose a chat to see the messages.</h6>
            </div>
        )
    }

    return (
        <div className="w-full">
            <ActiveConversationUserCard conversationParticipant={conversationParticipant} />
            <MessageList
                conversation={optimisticConversation}
                recipient={recipient}
            />
            <SendMessage
                addOptimisticMessage={addOptimisticMessage}
                conversationId={conversation.id}
                addLocalMessage={addLocalMessage}
            />
        </div >
    )
}