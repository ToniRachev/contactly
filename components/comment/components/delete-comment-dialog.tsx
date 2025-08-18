'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteCommentDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    deleteComment: (commentId: string) => void;
    commentId: string;
}

export default function DeleteCommentDialog({ open, setOpen, deleteComment, commentId }: Readonly<DeleteCommentDialogProps>) {
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
                            onClick={() => deleteComment(commentId)}
                        >
                            Delete
                        </Button>
                    </form>
                    <DialogClose asChild>
                        <Button variant={'destructive'}>Cancel</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}
