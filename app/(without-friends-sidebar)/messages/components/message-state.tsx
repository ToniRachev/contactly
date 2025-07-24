import { formatHour } from "@/lib/utils";

type MessageStateProps = {
    isSeen: boolean;
    isLastUserMessage: boolean;
    messageDate: Date;
    isLastMessage: boolean;
    isSended: boolean;
}

export default function MessageState({ isSeen, isLastUserMessage, messageDate, isLastMessage, isSended }: Readonly<MessageStateProps>) {
    const messageStatus = isSeen ? 'Read' : isSended ? '' : 'Sending...';

    return (
        <div>
            {isLastUserMessage && (
                <div className="flex justify-end items-center">
                    <p className="text-xs text-gray-300 pt-2">{messageStatus}</p>
                </div>
            )}

            {isLastMessage && (
                <div className="flex flex-col justify-end items-end pt-4 w-full">
                    <p>{formatHour(messageDate)}</p>
                </div>
            )}
        </div>
    )
}