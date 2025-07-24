import { useAuthenticatedUser } from "@/lib/context/user.context";
import { MessageType } from "@/lib/types/conversation";
import { cva } from "class-variance-authority";
import MessageState from "./message-state";

type MessageProps = {
    message: MessageType;
    lastUserMessageId: string | undefined;
    isSeen: boolean;
    isLastMessage: boolean;
}

const messageStyle = cva('p-4 rounded-md', {
    variants: {
        variant: {
            incoming: 'bg-[#3D3D3D]',
            outgoing: 'bg-[#17486B]'
        }
    }
})

export default function Message({ message, lastUserMessageId, isSeen, isLastMessage }: Readonly<MessageProps>) {
    const { user } = useAuthenticatedUser();

    const messageVariant = message.senderId === user.id ? 'outgoing' : 'incoming';
    const alignItems = messageVariant === 'incoming' ? 'start' : 'end';

    return (
        <div className="w-full flex flex-col"
            style={{
                alignItems
            }}
        >
            <div className="max-w-[25vw]">
                <div className={messageStyle({ variant: messageVariant })}>
                    <p>{message.content}</p>
                </div>

                <MessageState
                    isSeen={isSeen}
                    isLastUserMessage={lastUserMessageId === message.id}
                    messageDate={message.createdAt}
                    isLastMessage={isLastMessage}
                    isSended={message.sended}
                />
            </div>
        </div>
    )
}
