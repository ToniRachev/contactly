import { useActionState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { deleteUserBioFieldAction } from "@/lib/actions/user/user.actions";
import { FieldConfig } from "./types";
import { useAuthenticatedUser } from "@/lib/context/user.context";

type DeleteButtonProps = {
    config: FieldConfig;
    closeEditing: () => void;
}

export default function DeleteButton({ config, closeEditing }: Readonly<DeleteButtonProps>) {

    const { updateUserBioField } = useAuthenticatedUser();
    const deleteActionWrapper = deleteUserBioFieldAction.bind(null, config.dbField);
    const [deleteState, deleteFormAction, isDeletePending] = useActionState(deleteActionWrapper, {
        error: null,
        success: false
    });

    useEffect(() => {
        if (deleteState.success) {
            updateUserBioField(config.name, '');
            closeEditing();
        }
    }, [deleteState, config.name, updateUserBioField, closeEditing])

    return (
        <form className="w-full h-full">
            <button formAction={deleteFormAction} disabled={isDeletePending}>
                <Trash2 width={20} className="cursor-pointer" />
            </button>
        </form>
    )
}