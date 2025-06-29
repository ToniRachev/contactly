import { cva } from "class-variance-authority";

type MessageProps = {
    message: {
        id: string;
        senderId: string;
        message: string;
        sendedAt: string;
    }
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
    const currentUserId = 'user_2';

    const messageVariant = message.senderId === currentUserId ? 'outgoing' : 'incoming';
    const alignItems = messageVariant === 'incoming' ? 'start' : 'end';

    return (
        <div className="w-full flex flex-col"
            style={{
                alignItems
            }}
        >
            <div className="max-w-[25vw]">
                <div className={messageStyle({ variant: messageVariant })}>
                    <p>{message.message}</p>
                </div>

                {isLastMessage && (
                    <div className="flex justify-end items-center pt-4 w-full">
                        {/* <UserAvatar avatar={'/user_avatar.webp'} width={30} height={30} /> */}
                        <p>{message.sendedAt}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
