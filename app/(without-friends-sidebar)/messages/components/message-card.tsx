import Avatar from "@/components/user-avatar";

type MessageCardProps = {
    avatar: string;
    username: string;
    lastMessage: string;
    date: string;
    newMessagesCount: number;
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

export default function MessageCard({ avatar,
    username,
    lastMessage,
    date,
    newMessagesCount }: Readonly<MessageCardProps>) {
    const messagesCount = formatMessagesCount(newMessagesCount);
    const formatedLastMessage = lastMessage.length > 27 ? `${lastMessage.slice(0, 27)}...` : lastMessage;

    return (
        <div className="flex py-4 justify-between items-center cursor-pointer hover:bg-blue-500 rounded-xl p-2">
            <Avatar avatar={avatar} size={'sm'} />
            <div>
                <h6>{username}</h6>
                <p>{formatedLastMessage}</p>
            </div>

            <div className="flex flex-col justify-center items-center gap-1">
                <p>{date}</p>
                {messagesCount && (
                    <div className="w-7 h-7 rounded-full flex justify-center items-center bg-green-600">{messagesCount}</div>
                )}
            </div>
        </div>
    )
}
