'use client';

import { useActionState, useEffect } from "react";
import { deleteCommentAction } from "@/lib/actions/comment/comment.actions";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/error-message";

type DeleteCommentDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    deleteComment: (commentId: string) => void;
    commentId: string;
}

export default function DeleteCommentDialog({ open, setOpen, deleteComment, commentId }: Readonly<DeleteCommentDialogProps>) {
    const { user } = useAuthenticatedUser();


    const deleteCommentActionWithUserAndCommentId = deleteCommentAction.bind(null, user.id, commentId);
    const [state, formAction, isPending] = useActionState(deleteCommentActionWithUserAndCommentId, {
        success: false,
        error: null
    })

    useEffect(() => {
        if (state.success && open) {
            deleteComment(commentId);
        }

    }, [state.success, commentId, deleteComment, open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="border-none">
                <DialogHeader className="border-b-1 border-stone-500 pb-4">
                    <DialogTitle className="!text-lg">Delete comment</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this comment?</p>

                <div className="grid grid-cols-2 gap-2">
                    <form className="w-full">
                        <Button
                            variant={'secondary'}
                            className="w-full"
                            formAction={formAction}
                            disabled={isPending}
                        >
                            {isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </form>
                    <DialogClose asChild>
                        <Button variant={'destructive'}>Cancel</Button>
                    </DialogClose>


                    {state.error && (
                        <div className="col-span-2">
                            <ErrorMessage>{state.error}</ErrorMessage>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
