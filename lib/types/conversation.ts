import { UserWithPresenceStatusDBType, UserWithPresenceStatusType } from "./user";

export type MessageDBType = {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: Date;
}

export type MessageType = {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    sended: boolean;
}

export type ConversationParticipantDBType = {
    conversation_id: string;
    last_read_at: Date;
    last_read_message_id: string;
    user_id: string;
}

export type ConversationParticipantType = {
    conversationId: string;
    lastReadAt: Date;
    lastReadMessageId: string;
    userId: string;
}

export type ConversationDBType = {
    id: string;
    user1_id: string;
    user2_id: string;
    created_at: Date;
    messages: MessageDBType[];
    conversation_participants: ConversationParticipantDBType[];
}

export type ConversationType = {
    id: string;
    user1Id: string;
    user2Id: string;
    createdAt: Date;
    messages: MessageType[];
    participants: ConversationParticipantType[];
}

export type BaseConversationOverviewDBType = {
    id: string;
    user_id: string;
    conversation_id: string;
    last_message_id: string;
    last_message_preview: string;
    last_message_at: string;
    unread_count: number;
}

export type BaseConversationOverviewType = {
    id: string;
    userId: string;
    conversationId: string;
    lastMessageId: string;
    lastMessagePreview: string;
    lastMessageAt: string;
    unreadCount: number;
}

export type ConversationOverviewDBType = BaseConversationOverviewDBType & {
    conversation_participants: {
        user1: UserWithPresenceStatusDBType;
        user2: UserWithPresenceStatusDBType;
    };
}

export type ConversationOverviewType = BaseConversationOverviewType & {
    participant: UserWithPresenceStatusType;
}