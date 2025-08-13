'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAuthenticatedUser } from "@/lib/context/user.context";
import Trigger from "./components/trigger";
import useCreatePost from "./hooks/useCreatePost";
import Post from "./components/post";
import EditImages from "./components/edit-images";
import { ChevronLeft } from "lucide-react";

export default function CreatePost() {
    const { dialog, postImages } = useCreatePost();
    const { user } = useAuthenticatedUser();

    const dialogTitle = dialog.isEditingImages ? "Edit images" : "Create post";

    return (
        <Dialog open={dialog.open} onOpenChange={dialog.handleOpenChange}>
            <DialogTrigger className="w-full max-w-[50svw]">
                <Trigger avatarUrl={user.avatarUrl} />
            </DialogTrigger>
            <DialogContent className="border-none !w-auto !max-w-[70svw]">
                <DialogHeader className="border-b-1 border-stone-500 pb-4">
                    <DialogTitle className="!text-lg text-center relative">
                        {dialog.isEditingImages && (
                            <button className="flex items-center gap-1 absolute left-0 top-0 " onClick={() => dialog.setIsEditingImages(false)}>
                                <ChevronLeft className="w-5 h-5" />
                                <span className="text-sm">Back</span>
                            </button>
                        )}
                        {dialogTitle}
                    </DialogTitle>
                </DialogHeader>

                {!dialog.isEditingImages ? (
                    <Post
                        closeDialog={dialog.closeDialog}
                        postImages={postImages}
                        openEditImages={() => dialog.setIsEditingImages(true)}
                    />
                ) : (
                    <EditImages
                        images={postImages.images}
                        removeImage={postImages.handleRemoveImage}
                        addImageCaption={postImages.handleAddImageCaption}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}