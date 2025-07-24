import { ConversationType } from "@/lib/types/conversation";

export const getLastUnreadMessageId = (conversation: ConversationType, userId: string) => {
    const participantMessages = conversation?.messages.filter((message) => message.senderId !== userId);

    const lastMessageId = participantMessages[participantMessages.length - 1]?.id ?? null;
    const latestReadMessageId = conversation?.participants.find((participant) => participant.userId === userId)?.lastReadMessageId;

    return {
        lastMessageId,
        isUnread: lastMessageId !== latestReadMessageId
    }
}