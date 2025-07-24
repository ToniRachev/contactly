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