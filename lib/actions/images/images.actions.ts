'use server';

import { createClient } from "@/lib/utils/supabase/server";

// Handle errors

export async function uploadPostImages(images: FormDataEntryValue[], userId: string) {
    const supabase = await createClient();
    const imagesPromises = [];

    for (const image of images) {
        const uuid = crypto.randomUUID();

        const filePath = `${userId}/${uuid}`;

        imagesPromises.push(supabase.storage.from('posts').upload(filePath, image, { upsert: true }))
    }

    const results = await Promise.all(imagesPromises);
    return results.map((result) => `${process.env.IMAGE_PATH}${result.data?.fullPath}`)
}