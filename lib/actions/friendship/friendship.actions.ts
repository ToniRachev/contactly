'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server"
import { transformFriendRequestsUsers } from "@/lib/utils/transform";
import { FriendRequestUserDBType } from "@/lib/types/user";

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
            message: 'Friend request sent successfully'
        }
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: 'Failed to send friend request'
        }
    }
}

export async function cancelFriendRequest(senderId: string, receiverId: string) {
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
            message: 'Friend request cancelled successfully'
        }
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: 'Failed to cancel friend request'
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