import UserAvatarWithStatus from "@/components/user-avatar-with-status";
import Message from "./message";
import { PresenceStatusType } from "@/lib/types/user";

type MessageType = {
    id: string;
    senderId: string;
    message: string;
    sendedAt: string;
}

type ConversationProps = {
    conversation: {
        friend: {
            avatar: string;
            status: PresenceStatusType;
            name: string;
        },
        messages: MessageType[];
    }
}

export default function Conversation({ conversation }: Readonly<ConversationProps>) {
    return (
        <div className="w-full">
            <div className="flex items-center gap-4">
                <UserAvatarWithStatus
                    avatar={conversation.friend.avatar}
                    status={conversation.friend.status}
                    size='md'
                />
                <div>
                    <h6>{conversation.friend.name}</h6>
                    <p className="first-letter:uppercase">{conversation.friend.status}</p>
                </div>
            </div>

            <div className="max-h-[70vh] h-[70vh] flex mt-6 mb-6 justify-end overflow-hidden">
                <div
                    className="flex flex-col-reverse gap-8 w-full h-full overflow-y-scroll pr-4 
                    [&::-webkit-scrollbar]:w-2 
                    [&::-webkit-scrollbar-track]:bg-surface
                    [&::-webkit-scrollbar-thumb]:bg-[#8C8C8C]
                    [&::-webkit-scrollbar-button]:hidden"
                >
                    {conversation.messages.slice().reverse().map((message, index) => {
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
        </div >
    )
}