'use server';

import { baseFetcher } from "@/lib/utils/supabase/helpers";
import { createClient } from "@/lib/utils/supabase/server";
import { AlbumType, AlbumTypeEnum } from "@/lib/types/photos";
import { transformAlbum } from "@/lib/utils/transform";

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
    images: FormDataEntryValue[];
}

export async function getAlbum({ author, type }: GetOrCreateAlbumProps): Promise<AlbumType | null> {
    const supabase = await createClient();

    const data = await baseFetcher(
        supabase.from('albums')
            .select('*')
            .eq('author_id', author)
            .eq('type', type)
            .maybeSingle()
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
            .select('*')
            .single()
    )

    return transformAlbum(data);
}

export async function getOrCreateAlbumId({ author, type }: GetOrCreateAlbumProps) {
    const existing = await getAlbum({ author, type });

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

export async function addPostPhotos({ album, author, images }: AddPostPhotosProps) {
    const albumId = album ?? (await createAlbum({ author, type: AlbumTypeEnum.TIMELINE })).id;

    const photosUrls = await uploadPostImagesToStorage(images);
    const photosToInsert = photosUrls.map((url) => ({
        url,
        author_id: author,
        album_id: albumId,
    }));

    const supabase = await createClient();

    await baseFetcher(
        supabase.from('photos').insert(photosToInsert)
    )

    return albumId;
}