'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { transformMessage } from "@/lib/utils/transform";

type MessageMetaType = {
    senderId: string;
    conversationId: string | undefined;
}

export async function createMessage(messageMeta: MessageMetaType, content: string) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('messages').insert({
            sender_id: messageMeta.senderId,
            content,
            conversation_id: messageMeta.conversationId,
        })
            .select('*')
    )

    return transformMessage(data[0]);
}

export type CreateMessageActionState = {
    message: string;
    error: string | null;
    success: boolean;
}

export async function createMessageAction(messageMeta: MessageMetaType, state: CreateMessageActionState, formData: FormData) {
    if (!messageMeta.conversationId) return { message: state.message, error: 'Conversation not found', success: false };
    const message = formData.get('message') as string;

    if (!message) return { message: state.message, error: 'Message is required', success: false };

    try {
        await createMessage(messageMeta, message);

        return { message, error: null, success: true };
    } catch (error) {
        console.error(error);
        return { message, error: 'Failed to send message', success: false };
    }
}
