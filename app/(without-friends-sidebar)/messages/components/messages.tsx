import MessageCard from "./message-card";

type MessageProps = {
    messages: {
        id: string;
        avatar: string;
        username: string;
        lastMessage: string;
        date: string;
        newMessagesCount: number;
    }[];
}

export default function Messages({ messages }: Readonly<MessageProps>) {
    return (
        <div className="pt-12">
            {messages.map((message) => (
                <MessageCard key={message.id} {...message} />
            ))}
        </div>
    )
}