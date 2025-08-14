'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { AlbumType, AlbumTypeEnum } from "@/lib/types/photos";
import { transformAlbum, transformPhoto } from "@/lib/utils/transform";
import { albumQuery, photoCommentQuery, photoQuery } from "@/lib/utils/supabase/queries";

type CreatePhotoProps = {
    url: string;
    author: string;
    album: string;
    caption?: string | null;
}

type GetOrCreateAlbumProps = {
    author: string;
    type: AlbumTypeEnum;
}

type AddPostPhotosProps = {
    album: string | null;
    author: string;
    photos: {
        file: FormDataEntryValue;
        caption: string;
    }[];
}

type PhotoReactionProps = {
    id: string;
    userId: string;
    isLikedPhoto: boolean;
}

type AddPhotoCommentProps = {
    photoId: string;
    userId: string;
    body: string;
}

export async function getAlbumByTypeAndAuthor({ author, type }: GetOrCreateAlbumProps): Promise<AlbumType | null> {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('albums')
            .select(albumQuery)
            .eq('author_id', author)
            .eq('type', type)
            .maybeSingle()
    )

    return data ? transformAlbum(data) : null;
}

type GetAlbumByIdProps = {
    id: string;
}

export async function getAlbumById({ id }: GetAlbumByIdProps): Promise<AlbumType | null> {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('albums').select(albumQuery).eq('id', id).maybeSingle()
    )

    return data ? transformAlbum(data) : null;
}

export async function createAlbum({ author, type }: GetOrCreateAlbumProps): Promise<AlbumType> {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('albums').insert({
            author_id: author,
            type,
        })
            .select(albumQuery)
            .single()
    )

    return transformAlbum(data);
}

export async function getOrCreateAlbumId({ author, type }: GetOrCreateAlbumProps) {
    const existing = await getAlbumByTypeAndAuthor({ author, type });

    if (existing) {
        return existing.id;
    }

    const data = await createAlbum({ author, type });
    return data.id;
}

export async function createPhoto({ url, author, album, caption = null }: CreatePhotoProps) {
    const supabase = await createClient();

    await baseFetcher(
        supabase.from('photos').insert({
            url,
            author_id: author,
            album_id: album,
            caption,
        })
    )
}

export async function uploadPostImagesToStorage(images: FormDataEntryValue[]) {
    const supabase = await createClient();
    const imagesPromises = [];

    for (const image of images) {
        const uuid = crypto.randomUUID();

        imagesPromises.push(supabase.storage.from('posts').upload(uuid, image, { upsert: true }))
    }

    const results = await Promise.all(imagesPromises);
    return results.map((result) => `${process.env.IMAGE_PATH}${result.data?.fullPath}`)
}

export async function addPostPhotos({ album, author, photos }: AddPostPhotosProps) {
    const albumId = album ?? (await createAlbum({ author, type: AlbumTypeEnum.TIMELINE })).id;

    const photosUrls = await uploadPostImagesToStorage(photos.map((photo) => photo.file));
    const photosToInsert = photosUrls.map((url, index) => ({
        url,
        author_id: author,
        album_id: albumId,
        caption: photos[index].caption
    }));

    const supabase = await createClient();

    await baseFetcher(
        supabase.from('photos').insert(photosToInsert)
    )

    return albumId;
}

type GetPhotoProps = {
    id: string;
}

export async function getPhoto({ id }: GetPhotoProps) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('photos').select(photoQuery).eq('id', id).single()
    )

    return data ? transformPhoto(data) : null;
}

export async function photoReaction({ id, userId, isLikedPhoto }: PhotoReactionProps) {
    const supabase = await createClient();

    try {
        if (isLikedPhoto) {
            await baseFetcher(
                supabase.from('likes_photos').delete().eq('photo_id', id).eq('user_id', userId)
            )
        } else {
            await baseFetcher(
                supabase.from('likes_photos')
                    .insert({
                        photo_id: id,
                        user_id: userId,
                    })
                    .select('*')
                    .single()
            )
        }
        return {
            success: true,
        }

    } catch (error) {
        console.error(error);
        return {
            success: false,
        }
    }
}



export async function addPhotoComment({ photoId, userId, body }: AddPhotoCommentProps) {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('comments_photos').insert({
            photo_id: photoId,
            author_id: userId,
            body,
        })
            .select(photoCommentQuery)
            .single()
    )
}