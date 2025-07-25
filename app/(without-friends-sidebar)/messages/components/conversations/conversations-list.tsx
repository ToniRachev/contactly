'use client';

import { useConversations } from "@/lib/context/conversations.context";
import ConversationCard from "./conversation-card";

export default function ConversationsList() {
    const { conversations } = useConversations();

    return (
        <div className="pt-12">
            {conversations.map((conversation) => (
                <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
        </div>
    )
}