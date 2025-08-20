'use server';

import { MESSAGES } from "@/lib/constants/messages";
import { parseAndValidateFormData } from "@/lib/utils";
import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { transformPosts } from "@/lib/utils/transform";
import { postSchema, PostSchemaErrorType, PostSchemaType } from "@/lib/validations/postSchema";
import { createFormResult } from "@/lib/validations/utils";
import { PostDBType, PostType } from "@/lib/types/post";
import { getAuthUserId } from "@/lib/actions/user/user.actions";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { postQuery } from "@/lib/utils/supabase/queries";
import { addPostPhotos } from "../photos/photos.actions";

type PostState = {
    data: PostSchemaType;
    errors: PostSchemaErrorType;
    success: boolean;
}

type SubmitPostState = PostState & { newPost: PostType | null }

export async function fetchPosts(currentUserId: string, limit: number = 10) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('posts')
            .select(postQuery)
            .neq('author_id', currentUserId)
            .limit(limit)
            .order('created_at', { ascending: false })
    );

    return transformPosts(data as unknown as PostDBType[]);
}

export async function fetchUserPosts(userId: string, limit: number = 10) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('posts')
            .select(postQuery)
            .eq('author_id', userId)
            .limit(limit)
            .order('created_at', { ascending: false })
    );

    return transformPosts(data as unknown as PostDBType[]);
}

export async function createPost(authorId: string, postData: { body: string, albumId: string }) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase
            .from('posts')
            .insert([{
                author_id: authorId,
                body: postData.body,
                album_id: postData.albumId,
            }])
            .select(postQuery)
    )

    const transformedPost = transformPosts(data as unknown as PostDBType[]);
    return transformedPost[0];
}

export async function editPost(postId: string, postContent: string) {
    const supabase = await createClient();
    const userId = await getAuthUserId();

    const data = await baseFetcher(
        supabase.from('posts')
            .update({ body: postContent })
            .match({ id: postId, author_id: userId })
            .select(postQuery));

    const transformedPost = transformPosts(data as unknown as PostDBType[]);
    return transformedPost[0];
}

export const deletePost = async (postId: string) => {
    const supabase = await createClient();
    const userId = await getAuthUserId();

    await baseFetcher(supabase.from('posts').delete().match({ id: postId, author_id: userId }))
}

export async function submitPost(path: string, state: SubmitPostState, formData: FormData) {
    const data = {
        body: formData.get('body'),
        images: formData.getAll('images'),
        captions: formData.getAll('captions')
    }

    const result = postSchema.safeParse(data);

    if (!result.success) {
        return {
            ...createFormResult(data as unknown as PostSchemaType, result.error.formErrors as PostSchemaErrorType, false),
            newPost: null,
        }
    }

    const mappedPhotosWithCaptions = data.images.map((image, index) => ({
        file: image,
        caption: data.captions[index] as string
    }));

    try {
        const userId = await getAuthUserId();
        const albumId = await addPostPhotos({
            album: null,
            author: userId,
            photos: mappedPhotosWithCaptions
        })

        const newPost = await createPost(userId, {
            body: result.data.body,
            albumId,
        });

        if (path === '/') {
            redirect('/profile');
        }

        return {
            ...createFormResult({ body: '' } as PostSchemaType, null, true),
            newPost,
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        console.error('Failed to create post', error);
        return {
            ...createFormResult(data as unknown as PostSchemaType, MESSAGES.genericError, false),
            newPost: null,
        }
    }
}

export async function editPostAction(postId: string, state: PostState, formData: FormData) {
    const { data, result } = parseAndValidateFormData(formData, postSchema, [
        'body'
    ]);

    if (!result.success) {
        return {
            ...createFormResult(data as unknown as PostSchemaType, result.error.formErrors as PostSchemaErrorType, false),
            success: false,
        }
    }

    if (state.data.body === result.data.body) {
        return createFormResult(result.data, {} as PostSchemaErrorType, false)
    }

    try {
        await editPost(postId, result.data.body);
        return createFormResult(result.data, {} as PostSchemaErrorType, true)
    } catch (error) {
        console.error('Failed to edit post', error);
        return createFormResult(result.data, MESSAGES.genericError, false)
    }
}

export async function deletePostAction(postId: string) {
    try {
        await deletePost(postId)

        return {
            success: true,
            error: null
        }

    } catch (error) {
        console.error('Failed to delete post', error);
        return {
            success: false,
            error: MESSAGES.genericError
        }
    }
}
