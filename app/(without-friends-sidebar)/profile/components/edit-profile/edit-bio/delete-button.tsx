import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteUserBioFieldAction } from "@/lib/actions/user/user.actions";
import { FieldConfig } from "./types";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { flushSync } from "react-dom";

type DeleteButtonProps = {
    config: FieldConfig;
}

export default function DeleteButton({ config }: Readonly<DeleteButtonProps>) {

    const { updateUserBioField } = useAuthenticatedUser();
    const deleteActionWrapper = deleteUserBioFieldAction.bind(null, config.dbField);
    const [, deleteFormAction, isDeletePending] = useActionState(deleteActionWrapper, {
        error: null,
        success: false
    });

    const handleDeleteUserBioField = async () => {
        flushSync(() => {
            updateUserBioField(config.name, '');
        })
        deleteFormAction();
    }

    return (
        <form className="w-full h-full">
            <button formAction={handleDeleteUserBioField} disabled={isDeletePending}>
                <Trash2 width={20} className="cursor-pointer" />
            </button>
        </form>
    )
}