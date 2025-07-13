'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server"
import { transformFriendRequestsUsers } from "@/lib/utils/transform";
import { FriendRequestUserDBType } from "@/lib/types/user";
import { MESSAGES } from "@/lib/constants/messages";

export async function sendFriendRequest(senderId: string, receiverId: string) {
    const supabase = await createClient();

    try {
        await baseFetcher(
            supabase.from('friend_requests')
                .insert([{
                    sender_id: senderId,
                    receiver_id: receiverId
                }])
        )

        return {
            success: true,
            error: null
        }
    } catch (error) {
        console.error(error);

        return {
            success: false,
            error: MESSAGES.genericError
        }
    }
}

export async function acceptFriendRequest(senderId: string, receiverId: string) {
    const supabase = await createClient();

    try {
        await baseFetcher(
            supabase.from('friends')
                .insert([
                    { user_id: receiverId, friend_id: senderId },
                    { user_id: senderId, friend_id: receiverId }
                ])
        )

        await baseFetcher(
            supabase.from('friend_requests')
                .delete()
                .match({ sender_id: senderId, receiver_id: receiverId })
        )

        return {
            success: true,
            error: null,
        }
    } catch (error) {
        console.error(error);

        return {
            success: false,
            error: MESSAGES.genericError,
        }
    }
}

export async function deleteFriendRequest(senderId: string, receiverId: string) {
    const supabase = await createClient();

    try {
        await baseFetcher(
            supabase.from('friend_requests')
                .delete()
                .match({
                    sender_id: senderId,
                    receiver_id: receiverId
                })
        )

        return {
            success: true,
            error: null,
        }
    } catch (error) {
        console.error(error);

        return {
            success: false,
            error: MESSAGES.genericError,
        }
    }
}

export async function getFriendsSendRequests(userId: string) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('friend_requests')
            .select('receiver_id')
            .eq('sender_id', userId)
    )

    return data.map((request) => request.receiver_id);
}

export async function getFriendRequests(userId: string) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('friend_requests')
            .select('user:sender_id(*)')
            .eq('receiver_id', userId)
    ) as unknown as FriendRequestUserDBType[];

    return transformFriendRequestsUsers(data);
}
