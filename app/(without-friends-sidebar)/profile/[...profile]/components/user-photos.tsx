import { fetchUserPhotos } from "@/lib/actions/photos/photos.actions";
import PhotoLink from "./photo-link";
import SectionWrapper from "./section-wrapper";

type UserPhotosProps = {
    profileId: string;
}

export default async function UserPhotos({ profileId }: Readonly<UserPhotosProps>) {
    const photos = await fetchUserPhotos(profileId);
    return (
        <SectionWrapper title="Photos">
            <ul className="grid grid-cols-6 gap-3">
                {photos.map((photo) => (
                    <li key={photo.id}>
                        <PhotoLink photo={photo} />
                    </li>
                ))}
            </ul>
        </SectionWrapper>
    )
}