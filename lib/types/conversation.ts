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
}

export type ConversationDBType = {
    id: string;
    user1_id: string;
    user2_id: string;
    created_at: Date;
    messages: MessageDBType[];
}

export type ConversationType = {
    id: string;
    user1Id: string;
    user2Id: string;
    createdAt: Date;
    messages: MessageType[];
}