import { ConversationParticipantType, ConversationType } from "@/lib/types/conversation";
import Message from "./message";
import { useAuthenticatedUser } from "@/lib/context/user.context";

type MessageListProps = {
    conversation: ConversationType | null;
    recipient: ConversationParticipantType | undefined;
}


export default function MessageList({ conversation, recipient }: Readonly<MessageListProps>) {
    const { user } = useAuthenticatedUser();

    const messages = conversation?.messages.slice().reverse() || [];
    const lastUserMessage = messages.find((message) => message.senderId === user.id);

    return (
        <div className="max-h-[70vh] h-[70vh] flex mt-6 mb-6 justify-end overflow-hidden">
            <div
                className="flex flex-col-reverse gap-4 w-full h-full overflow-y-scroll pr-4
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-surface
            [&::-webkit-scrollbar-thumb]:bg-[#8C8C8C]
            [&::-webkit-scrollbar-button]:hidden"
            >
                {messages.map((message, index) => {
                    const isLastMessage = index === 0;

                    const isSeen = message.id === recipient?.lastReadMessageId;

                    return (
                        <Message
                            key={message.id}
                            message={message}
                            lastUserMessageId={lastUserMessage?.id}
                            isLastMessage={isLastMessage}
                            isSeen={isSeen}
                        />
                    )
                })}
            </div>
        </div>
    )
}