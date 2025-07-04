'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Post from "./post"
import UserAvatar from "../user-avatar";
import { Ellipsis, ThumbsUp } from "lucide-react";
import { Separator } from "../ui/separator";
import Filter from "../filter";
import MessageInput from "../message-input";
import { useActionState, useEffect, useRef, useState } from "react";
import { formatRelativeTime } from "@/lib/utils";
import { CommentType, PostType } from "@/lib/types/post";
import { createCommentAction, deleteCommentAction, editCommentAction } from "@/lib/actions/comment/comment.actions";
import { CommentSchemaErrorType, CommentSchemaType } from "@/lib/validations/postSchema";
import { useUser } from "@/lib/context/user.context";
import { Button } from "../ui/button";
import { flushSync } from "react-dom";

const filters = [
    {
        value: 'mostLiked',
        label: 'Most liked',
        caption: 'Showing top comments that received the most love.'
    },
    {
        value: 'mostRecent',
        label: 'Most recent',
        caption: 'What people are saying right now.'
    }
]

type Controls = {
    setState: (state: boolean) => void;
    open: boolean;
}

type PostViewProps = {
    post: PostType;
    controls: Controls;
    reaction: () => void;
    isLikedPost: boolean;
    comments: CommentType[];
    addComment: (comment: CommentType) => void;
    editComment: (commentId: string, newContent: string) => void;
    deleteComment: (commentId: string) => void;
}

type CreateCommentProps = {
    postId: string;
    addComment: (comment: CommentType) => void;
}

type CommentFormProps = {
    formRef: React.RefObject<HTMLFormElement | null>;
    formAction: (formData: FormData) => void;
    isPending: boolean;
    value: string;
    error?: string;
    className?: string;
}

type DeleteCommentDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    deleteComment: (commentId: string) => void;
    commentId: string;
}

type CommentControlsProps = {
    setIsEditing: (isEditing: boolean) => void;
    commentId: string;
    deleteComment: (commentId: string) => void;
}

type CommentProps = {
    comment: CommentType;
    editComment: (commentId: string, newContent: string) => void;
    deleteComment: (commentId: string) => void;
}

const CommentForm = ({ formRef, formAction, value, error, isPending, className }: Readonly<CommentFormProps>) => {

    const handleSubmitComment = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (formRef.current) {
                formRef.current.requestSubmit();
            }
        }
    }

    return (
        <form ref={formRef} action={formAction} className="w-full ">
            <MessageInput
                placeholder="Add a comment..."
                name="body"
                className={className}
                onKeyDown={handleSubmitComment}
                error={error}
                disabled={isPending}
                value={value}
            />
        </form>
    )
}

const DeleteCommentDialog = ({ open, setOpen, deleteComment, commentId }: Readonly<DeleteCommentDialogProps>) => {
    const { user } = useUser();

    const deleteCommentActionWithUserAndCommentId = deleteCommentAction.bind(null, user?.id ?? '', commentId);
    const [, formAction, isPending] = useActionState(deleteCommentActionWithUserAndCommentId, {
        success: false
    })

    const handleDeleteComment = () => {
        flushSync(() => {
            deleteComment(commentId);
        });

        formAction();
    }

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
                            formAction={handleDeleteComment}
                            disabled={isPending}
                        >
                            {isPending ? 'Deleting...' : 'Delete'}
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

const CommentControls = ({ setIsEditing, commentId, deleteComment }: Readonly<CommentControlsProps>) => {
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

const Comment = ({ comment, editComment, deleteComment }: Readonly<CommentProps>) => {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);
    const isCommentAuthor = user?.id === comment.author.id;

    const editCommentActionWithUserAndCommentId = editCommentAction.bind(null, user?.id ?? '', comment.id);

    const [state, formAction, isPending] = useActionState(editCommentActionWithUserAndCommentId, {
        data: {
            body: comment.body,
        } as CommentSchemaType,
        errors: {} as CommentSchemaErrorType,
        success: false
    })

    useEffect(() => {
        if (state.success) {
            editComment(comment.id, state.data.body);
            setIsEditing(false);
        }
    }, [state.success, editComment, state.data.body, comment.id])

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex gap-2 w-full">
                <UserAvatar
                    width={32}
                    height={32}
                />

                <div className="w-full">
                    <div className="bg-surface w-full p-4 rounded-lg flex justify-between">
                        <div className="w-full">
                            <p className="text-sm pb-4">{comment.author.fullName}</p>

                            {!isEditing ? (
                                <p>{comment.body}</p>
                            ) : (
                                <div className="w-full">
                                    <div className="w-full border p-2 rounded-lg border-stone-700">
                                        <CommentForm
                                            formRef={formRef}
                                            formAction={formAction}
                                            value={state.data.body}
                                            isPending={isPending}
                                            className="w-full py-2 px-0 focus-visible:ring-0"
                                        />
                                    </div>

                                    <div className="py-2">
                                        <button onClick={() => setIsEditing(false)} className="text-sm text-red-500">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isCommentAuthor && (
                            <CommentControls setIsEditing={setIsEditing} commentId={comment.id} deleteComment={deleteComment} />
                        )}
                    </div>

                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p>{formatRelativeTime(comment.createdAt)}</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <ThumbsUp width={20} />
                            <span className="text-sm">{comment.likesCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CreateComment = ({ postId, addComment }: Readonly<CreateCommentProps>) => {
    const { user } = useUser();
    const formRef = useRef<HTMLFormElement>(null);

    const createCommentActionWithUserAndPostId = createCommentAction.bind(null, postId, user?.id ?? '');

    const [state, formAction, isPending] = useActionState(createCommentActionWithUserAndPostId, {
        data: {
            body: '',
        } as CommentSchemaType,
        errors: {} as CommentSchemaErrorType,
        newComment: null,
        success: false
    })

    useEffect(() => {
        if (state.success) {
            addComment(state.newComment as CommentType);
        }
    }, [state.success, addComment, state.newComment])

    return (
        <div className="w-full flex gap-2 items-center sticky bottom-0 bg-background py-4">
            <UserAvatar avatar={'/user_avatar.webp'} width={32} height={32} />

            <CommentForm
                formRef={formRef}
                formAction={formAction}
                isPending={isPending}
                value={state.data.body}
                error={state.errors.fieldErrors?.body?.[0]}
            />
        </div>
    )
}

export function PostDetailedView({ post, controls, reaction, isLikedPost, comments, addComment, editComment, deleteComment }: Readonly<PostViewProps>) {
    return (
        <Dialog open={controls.open} onOpenChange={controls.setState}>
            <DialogContent className="min-w-[50vw] border-none">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>Post view</DialogTitle>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col gap-4 relative max-h-[80vh] overflow-y-auto pr-4
                      [&::-webkit-scrollbar]:w-2 
                    [&::-webkit-scrollbar-track]:bg-surface
                    [&::-webkit-scrollbar-thumb]:bg-[#8C8C8C]
                    [&::-webkit-scrollbar-button]:hidden
                ">
                    <Post post={post} reaction={reaction} isLikedPost={isLikedPost} />

                    <Separator className="opacity-25" />
                    <Filter filters={filters} />

                    {comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} editComment={editComment} deleteComment={deleteComment} />
                    ))}

                    <CreateComment postId={post.postId} addComment={addComment} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
