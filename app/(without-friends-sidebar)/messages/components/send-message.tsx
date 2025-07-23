'use client';

import MessageInput from "@/components/message-input";
import { createMessage } from "@/lib/actions/message/message.actions";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { MessageType } from "@/lib/types/conversation";

import { startTransition, useRef } from "react";

type SendMessageProps = {
    addOptimisticMessage: (message: MessageType) => void;
    conversationId: string;
    addLocalMessage: (message: MessageType) => void;
}

export default function SendMessage({ addOptimisticMessage, conversationId, addLocalMessage }: Readonly<SendMessageProps>) {
    const formRef = useRef<HTMLFormElement>(null);

    const { user } = useAuthenticatedUser();

    const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (!formRef.current || !conversationId) return;

            const message = formRef.current.message.value as string;

            startTransition(async () => {
                addOptimisticMessage({
                    id: `optimistic-${Date.now()}-${Math.random()}`,
                    content: message,
                    senderId: user.id,
                    conversationId: conversationId,
                    createdAt: new Date(Date.now()),
                    sended: false,
                })

                formRef?.current?.reset();

                await handleSendMessage(message)
            })
        }
    }

    const handleSendMessage = async (message: string) => {
        const createdMessage = await createMessage({
            senderId: user.id,
            conversationId: conversationId,
        }, message)

        startTransition(() => {
            addLocalMessage(createdMessage)
        })
    }

    return (
        <div className="flex justify-end w-full">
            <div>
                <form ref={formRef}>
                    <MessageInput
                        placeholder="Type a message..."
                        name="message"
                        className="w-[30vw]"
                        onKeyDown={handleSubmit}
                    />
                </form>
            </div>
        </div>
    )
}