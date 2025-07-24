'use client';

import { ConversationType } from "@/lib/types/conversation";
import { useEffect } from "react";
import { getLastUnreadMessageId } from "../utils";
import { readMessage } from "@/lib/client/message.client";

export default function useMarkConversationRead(activeConversation: ConversationType | null, userId: string) {
    useEffect(() => {
        if (!activeConversation) return;
        const { lastMessageId, isUnread } = getLastUnreadMessageId(activeConversation, userId);
        if (isUnread) {
            readMessage(activeConversation.id, userId, lastMessageId);
        }
    }, [activeConversation?.messages, userId])
}