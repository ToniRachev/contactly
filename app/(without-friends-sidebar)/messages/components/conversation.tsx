'use client';

import Message from "./message";
import { useMessageContext } from "@/lib/context/message.context";
import { ConversationType, MessageType } from "@/lib/types/conversation";
import { useOptimistic } from "react";
import SendMessage from "./send-message";
import useMessage from "@/hooks/useMessage";
import ActiveConversationUserCard from "./active-conversation-user-card";

export default function Conversation() {
    const { activeConversationUserId } = useMessageContext();
    const { activeConversation, loading, addLocalMessage } = useMessage(activeConversationUserId);

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
            <div className="max-h-[70vh] h-[70vh] flex mt-6 mb-6 justify-end overflow-hidden">
                <div
                    className="flex flex-col-reverse gap-8 w-full h-full overflow-y-scroll pr-4
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:bg-surface
                    [&::-webkit-scrollbar-thumb]:bg-[#8C8C8C]
                    [&::-webkit-scrollbar-button]:hidden"
                >
                    {optimisticConversation?.messages.slice().reverse().map((message, index) => {
                        const isLastMessage = index === 0;

                        return (
                            <Message
                                key={message.id}
                                message={message}
                                isLastMessage={isLastMessage}
                            />
                        )
                    })}
                </div>
            </div>

            <SendMessage
                addOptimisticMessage={addOptimisticMessage}
                conversationId={activeConversation.id}
                addLocalMessage={addLocalMessage}
            />
        </div >
    )
}