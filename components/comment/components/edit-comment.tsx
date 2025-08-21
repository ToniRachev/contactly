import TextForm from "@/components/text-form";
import { CommentType } from "@/lib/types/post";

type CommentFormProps = {
    comment: CommentType;
    editComment: (commentId: string, newContent: string) => void;
    closeEditing: () => void;
}

export default function EditCommentForm({ comment, editComment, closeEditing }: Readonly<CommentFormProps>) {

    const handleEditComment = (content: string) => {
        editComment(comment.id, content);
        closeEditing();
    }

    return (
        <div className="w-full">
            <div className="w-full border rounded-lg border-stone-700">
                <TextForm
                    value={comment.body}
                    onSubmit={handleEditComment}
                    name="body"
                    placeholder="Edit comment"
                />
            </div>

            <div className="py-2">
                <button onClick={closeEditing} className="text-sm text-red-500">Cancel</button>
            </div>
        </div>
    )
}