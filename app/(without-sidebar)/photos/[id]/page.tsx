import { fetchUserPhotos, getPhoto } from "@/lib/actions/photos/photos.actions";
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

    const photos = await fetchUserPhotos(photo.authorId);

    return (
        <Gallery
            initialPhotos={photos}
            activePhotoId={id}
        />
    )
}