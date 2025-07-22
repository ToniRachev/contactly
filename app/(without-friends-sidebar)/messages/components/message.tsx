import { useAuthenticatedUser } from "@/lib/context/user.context";
import { MessageType } from "@/lib/types/conversation";
import { formatHour } from "@/lib/utils";
import { cva } from "class-variance-authority";

type MessageProps = {
    message: MessageType;
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

export default function Message({ message, isLastMessage }: Readonly<MessageProps>) {
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

                {isLastMessage && (
                    <div className="flex justify-end items-center pt-4 w-full">
                        <p>{formatHour(message.createdAt)}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
