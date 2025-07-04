'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import DeleteCommentDialog from "./delete-comment-dialog";

type CommentControlsProps = {
    setIsEditing: (isEditing: boolean) => void;
    commentId: string;
    deleteComment: (commentId: string) => void;
}

export default function CommentControls({ setIsEditing, commentId, deleteComment }: Readonly<CommentControlsProps>) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <div className="absolute top-4 right-4">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Ellipsis />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-surface text-stone-100 border-stone-700 p-2 shadow-2xl">
                    <DropdownMenuItem onSelect={() => setIsEditing(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteCommentDialog
                open={isDeleteDialogOpen}
                setOpen={setIsDeleteDialogOpen}
                deleteComment={deleteComment}
                commentId={commentId}
            />
        </div>
    )
}