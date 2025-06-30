'use server';

import { MESSAGES } from "@/lib/constants/messages";
import { baseFetcher } from "../../helpers";
import { createClient } from "../../server";
import { transformFeed } from "../../utils/transform";
import { postSchema, PostSchemaErrorType, PostSchemaType } from "../../validations/postSchema";
import { createFormResult } from "../../validations/utils";
import { getUserId } from "../user/user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const fetchFeed = async (currentUserId: string, limit: number = 10) => {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('posts')
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`)
            .neq('author_id', currentUserId)
            .limit(limit)
            .order('created_at', { ascending: false })
    );

    return transformFeed(data);
}

export const fetchUserPosts = async (userId: string, limit: number = 10) => {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('posts')
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`)
            .eq('author_id', userId)
            .limit(limit)
            .order('created_at', { ascending: false })
    );

    return transformFeed(data);
}

export const createPost = async (authorId: string, body: string) => {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase
            .from('posts')
            .insert([{
                author_id: authorId,
                body
            }])
            .select(`*, commentsCount:comments(count), likesCount:likes_posts(count), likes:likes_posts(user:user_id), author:author_id(*)`)
    )

    const transformedPost = transformFeed(data);
    return transformedPost[0];
}

const parseAndValidateSubmitPostData = (formData: FormData) => {
    const data = {
        body: formData.get('body'),
    }

    const result = postSchema.safeParse(data);

    return { data, result };
}

type SubmitPostState = {
    data: PostSchemaType,
    errors: PostSchemaErrorType
}

export async function submitPost(state: SubmitPostState, formData: FormData) {
    const { data, result } = parseAndValidateSubmitPostData(formData);

    if (!result.success) {
        return createFormResult(data as PostSchemaType, result.error.formErrors)
    }

    try {
        const userId = await getUserId();
        await createPost(userId, result.data.body);
    } catch (error) {
        console.error('Failed to create post', error);
        return createFormResult(data as PostSchemaType, MESSAGES.genericError);
    }

    revalidatePath('/profile');
    redirect('/profile');
}