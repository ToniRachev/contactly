import { getAlbumById, getPhoto } from "@/lib/actions/photos/photos.actions";
import { notFound } from "next/navigation";
import Gallery from "./components/gallery";

type PhotosProps = {
    params: Promise<{
        id: string;
    }>
}

export default async function Photos({ params }: Readonly<PhotosProps>) {
    const { id } = await params;
    const photo = await getPhoto({ id });

    if (!photo) {
        return notFound();
    }

    const album = await getAlbumById({ id: photo.albumId });

    if (!album) {
        return notFound();
    }

    return (
        <div>
            <Gallery
                photos={album.photos}
                activePhotoId={id}
                author={album.author}
            />
        </div>
    )
}