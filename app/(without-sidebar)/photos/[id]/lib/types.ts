import { PhotoType } from "@/lib/types/photos";
import { UserProfileType } from "@/lib/types/user";

export type AddCommentType = (photoId: string, body: string, user: UserProfileType) => void;
export type DeleteCommentType = (entityId: string, commentId: string) => void;
export type EditCommentType = (entityId: string, commentId: string, newContent: string) => void;

export type PhotoCommentsType = {
    add: AddCommentType;
    edit: EditCommentType;
    delete: DeleteCommentType;
}

export type PhotoGalleryNavigationType = {
    handleNextPhoto: () => void;
    handlePreviousPhoto: () => void;
    activePhoto: PhotoType;
    activePhotoIndex: number;
}

export type PhotoReactionType = (photoId: string, isLikedPhoto: boolean, userId: string) => void;

