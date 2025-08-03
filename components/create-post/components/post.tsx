import { useAuthenticatedUser } from "@/lib/context/user.context";
import Form from "./form";
import UserHeader from "./user-header";
import { PostImagesType } from "../types";

type PostProps = {
    closeDialog: () => void;
    postImages: PostImagesType;
    openEditImages: () => void;
}

export default function Post({ closeDialog, postImages, openEditImages }: Readonly<PostProps>) {
    const { user } = useAuthenticatedUser();

    return (
        <div>
            <UserHeader
                avatarUrl={user.avatarUrl}
                fullName={user.fullName}
            />

            <Form
                closeDialog={closeDialog}
                postImages={postImages}
                openEditImages={openEditImages}
            />
        </div>
    )
}