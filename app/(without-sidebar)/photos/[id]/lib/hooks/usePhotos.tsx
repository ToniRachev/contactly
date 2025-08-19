'use client';

import { addPhotoComment, deletePhotoComment, editPhotoComment, photoCommentReaction, photoReaction } from "@/lib/actions/photos/photos.actions";
import { PhotoType } from "@/lib/types/photos";
import { CommentType } from "@/lib/types/post";
import { UserProfileType } from "@/lib/types/user";
import { createOptimisticComment } from "@/lib/utils";
import { startTransition, useOptimistic, useState } from "react";

const updatePhotosLikeState = (state: PhotoType[], photoId: string, isLikedPhoto: boolean, userId: string) => {
    return state.map(photo => {
        if (photo.id === photoId) {
            const updatedLikes = !isLikedPhoto
                ? [...photo.likes, userId]
                : photo.likes.filter(id => id !== userId);

            return { ...photo, likes: updatedLikes };
        }
        return photo;
    });
}

const updatePhotoComments = (state: PhotoType[], photoId: string, comment: CommentType) => {
    return state.map((photo) => {
        if (photo.id === photoId) {
            return {
                ...photo,
                comments: [...photo.comments, comment]
            }
        }
        return photo;
    })
}

const updatePhotoCommentState = (state: PhotoType[], photoId: string, commentId: string, newContent: string) => {
    return state.map((photo) => {
        if (photo.id === photoId) {
            return {
                ...photo,
                comments: photo.comments.map((comment) => comment.id === commentId ? { ...comment, body: newContent } : comment)
            }
        }
        return photo;
    })
}

const deletePhotoCommentState = (state: PhotoType[], photoId: string, commentId: string) => {
    return state.map((photo) => {
        if (photo.id === photoId) {
            return {
                ...photo,
                comments: photo.comments.filter((comment) => comment.id !== commentId)
            }
        }
        return photo;
    })
}

const updatePhotoCommentReactionState = (state: PhotoType[], photoId: string, commentId: string, userId: string, isLikedComment: boolean) => {
    return state.map((photo) => {
        console.log('photo', photo);
        if (photo.id === photoId) {
            return {
                ...photo,
                comments: photo.comments.map((comment) => {
                    if (comment.id === commentId) {
                        const likes = isLikedComment ? comment.likes.filter((id) => id !== userId) : [...comment.likes, userId];
                        return { ...comment, likes, likesCount: likes.length };
                    }
                    return comment;
                })
            }
        }
        return photo;
    })
}

export default function usePhotos(initialPhotos: PhotoType[], activePhotoId: string) {
    const [photosState, setPhotosState] = useState(initialPhotos);
    const [optimisticPhotos, updateOptimisticPhotos] = useOptimistic(photosState);

    const [activePhotoIndex, setActivePhotoIndex] = useState(optimisticPhotos.findIndex(photo => photo.id === activePhotoId));

    const activePhoto = optimisticPhotos[activePhotoIndex];

    const handleNextPhoto = () => {
        setActivePhotoIndex((prev) => {
            if (prev === optimisticPhotos.length - 1) {
                return 0;
            }

            return prev + 1;
        });
    }

    const handlePreviousPhoto = () => {
        setActivePhotoIndex((prev) => {
            if (prev === 0) {
                return optimisticPhotos.length - 1;
            }

            return prev - 1;
        });
    }

    const addPhotoCommentWithOptimism = async (photoId: string, body: string, user: UserProfileType) => {
        startTransition(async () => {
            updateOptimisticPhotos((state) => updatePhotoComments(state, photoId, createOptimisticComment({
                body,
                entityId: photoId,
                user,
            })));

            const comment = await addPhotoComment({
                photoId,
                userId: user.id,
                body,
            });

            startTransition(() => {
                setPhotosState((state) => updatePhotoComments(state, photoId, comment));
            })
        })
    }

    const photoReactionWithOptimism = (photoId: string, isLikedPhoto: boolean, userId: string) => {
        startTransition(async () => {
            updateOptimisticPhotos((state) => updatePhotosLikeState(state, photoId, isLikedPhoto, userId));

            try {
                await photoReaction({ id: photoId, userId: userId, isLikedPhoto });

                startTransition(() => {
                    setPhotosState((state) => updatePhotosLikeState(state, photoId, isLikedPhoto, userId));
                })
            } catch (error) {
                console.error('Failed to like photo', error);
            }
        })
    }

    const editPhotoCommentWithOptimism = (photoId: string, commentId: string, newContent: string) => {
        startTransition(async () => {
            updateOptimisticPhotos((state) => updatePhotoCommentState(state, photoId, commentId, newContent));

            try {
                await editPhotoComment({ commentId, body: newContent });

                startTransition(() => {
                    setPhotosState((state) => updatePhotoCommentState(state, photoId, commentId, newContent));
                })
            } catch (error) {
                console.error('Failed to edit photo comment', error);
            }
        })
    }

    const deletePhotoCommentWithOptimism = (photoId: string, commentId: string) => {
        startTransition(async () => {
            updateOptimisticPhotos((state) => deletePhotoCommentState(state, photoId, commentId));

            try {
                await deletePhotoComment({ commentId });

                startTransition(() => {
                    setPhotosState((state) => deletePhotoCommentState(state, photoId, commentId));
                })
            } catch (error) {
                console.error(error)
            }
        })
    }

    const reactionPhotoCommentWithOptimism = (photoId: string, commentId: string, userId: string, isLikedComment: boolean) => {
        startTransition(async () => {
            updateOptimisticPhotos((prevState) => updatePhotoCommentReactionState(prevState, photoId, commentId, userId, isLikedComment));

            await photoCommentReaction({ commentId, userId, isLikedComment });

            startTransition(() => {
                setPhotosState((prevState) => updatePhotoCommentReactionState(prevState, photoId, commentId, userId, isLikedComment));
            })
        })
    }

    return {
        photos: optimisticPhotos,
        galleryNavigation: {
            handleNextPhoto,
            handlePreviousPhoto,
            activePhoto,
            activePhotoIndex,
            setActivePhotoIndex,
        },
        togglePhotoReaction: photoReactionWithOptimism,
        photoComments: {
            add: addPhotoCommentWithOptimism,
            edit: editPhotoCommentWithOptimism,
            delete: deletePhotoCommentWithOptimism,
            reaction: reactionPhotoCommentWithOptimism,
        }
    }
}