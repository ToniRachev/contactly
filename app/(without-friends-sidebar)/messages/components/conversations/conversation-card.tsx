'use client';

import Avatar from "@/components/user-avatar";
import { useMessageContext } from "@/lib/context/message.context";
import { ConversationOverviewType } from "@/lib/types/conversation";
import { formatRecentOrDateTime } from "@/lib/utils";

type ConversationCardProps = {
    conversation: ConversationOverviewType;
}
const formatMessagesCount = (newMessagesCount: number) => {
    if (newMessagesCount === 0) {
        return ''
    }

    if (newMessagesCount > 9) {
        return '9+'
    }

    return String(newMessagesCount)
}

export default function ConversationCard({ conversation }: Readonly<ConversationCardProps>) {
    const { handleSetActiveConversationUserId } = useMessageContext();
    const messagesCount = formatMessagesCount(conversation.unreadCount);

    return (
        <div className="w-full">
            <button
                className="flex w-full py-4 justify-between items-center cursor-pointer hover:bg-blue-500 rounded-xl p-2"
                onClick={() => handleSetActiveConversationUserId(conversation.participant.id)}
            >
                <div className="flex items-center gap-2">
                    <Avatar avatar={conversation.participant.avatarUrl} size={'sm'} />
                    <div className="flex flex-col items-start">
                        <h6>{conversation.participant.fullName}</h6>
                        <p>{conversation.lastMessagePreview}</p>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center gap-1">
                    {conversation.lastMessageAt && <p>{formatRecentOrDateTime(new Date(conversation.lastMessageAt))}</p>}
                    {messagesCount && (
                        <div className="w-7 h-7 rounded-full flex justify-center items-center bg-green-600">{messagesCount}</div>
                    )}
                </div>
            </button>
        </div>
    )
}
