'use client';

import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import InputWrapper from "@/components/input-wrapper";
import { FieldConfig } from "./types";
import { deleteUserBioFieldAction, updateUserBioAction } from "@/lib/actions/user/user.actions";
import { useUser } from "@/lib/context/user.context";
import ErrorMessage from "@/components/error-message";
import { formatDate } from "date-fns";

type ControlsProps = {
    close: () => void;
    isPending?: boolean;
}

const Controls = ({ close, isPending }: ControlsProps) => {
    return (
        <div className="w-full flex justify-end gap-4">
            <Button
                variant={'destructive'}
                onClick={close}
                type="button"
                disabled={isPending}
            >
                Cancel
            </Button>
            <Button
                variant={'secondary'}
                type="submit"
                disabled={isPending}
            >
                Save
            </Button>
        </div>
    )
}

type FormFieldProps = {
    field: FieldConfig;
    closeEditing: () => void;
    callback: (field: string, newValue: string) => void;
}

const FormField = ({ field, closeEditing, callback }: FormFieldProps) => {
    const actionWrapper = updateUserBioAction.bind(null, field.name, field.dbField);

    const [state, formAction, isPending] = useActionState(actionWrapper, field.initialState);

    const error = state.errors?.fieldErrors?.[field.name]?.[0] ?? state.errors?.formErrors?.[0];

    useEffect(() => {
        if (state.success) {
            callback(field.name, state.data[field.name] as string);
            closeEditing();
        }
    }, [state, field, closeEditing, callback])

    return (
        <form action={formAction}>

            {field.type === 'date' ? (
                <li className="py-4 flex items-center">
                    <div>
                        <DatePicker
                            name={field.name}
                            value={state.data[field.name] as Date | undefined}
                        />
                        <ErrorMessage className="pt-2">{error}</ErrorMessage>
                    </div>
                    <Controls close={closeEditing} />
                </li>
            ) : (
                <>
                    < InputWrapper
                        name={field.name}
                        placeholder={field.placeholder}
                        defaultValue={state.data[field.name] as string}
                        label={field.label}
                        error={error}
                        className="selection:bg-blue-500 selection:text-white"
                    />

                    <div className="w-full flex justify-end gap-4 pt-4">
                        <Controls close={closeEditing} isPending={isPending} />
                    </div>
                </>
            )}
        </form>
    )
}

type EditFieldProps = {
    config: FieldConfig;
    callback: (field: string, newValue: string) => void;
}

export default function EditField({ config, callback }: Readonly<EditFieldProps>) {
    const [isEditing, setIsEditing] = useState(false);

    const deleteActionWrapper = deleteUserBioFieldAction.bind(null, config.dbField);
    const [deleteState, deleteFormAction, isDeletePending] = useActionState(deleteActionWrapper, {
        error: null,
        success: false
    });

    const { updateUserBioField } = useUser();

    useEffect(() => {
        if (deleteState.success) {
            updateUserBioField(config.name, '');
            setIsEditing(false);
        }
    }, [deleteState, config.name, updateUserBioField])

    if (isEditing) {
        return (
            <li className="py-2">
                <FormField
                    field={config}
                    closeEditing={() => setIsEditing(false)}
                    callback={callback}
                />
            </li>
        )
    }

    if (!config.data) {
        return (
            <li>
                <button
                    onClick={() => setIsEditing(true)}
                >
                    <div className="flex items-center gap-2 py-2 cursor-pointer w-fit">
                        <CirclePlus />
                        <p>{config.placeholder}</p>
                    </div>
                </button>
            </li>
        )
    }

    return (
        <li className="flex justify-between py-2">
            <button
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => setIsEditing(true)}
            >
                {config.icon}
                <p>{config.type === 'date' ? formatDate(config.data, "MMM d, yyyy") : config.data}</p>
            </button>

            <div className="grid grid-cols-2 gap-2">
                <form className="w-full h-full">
                    <button formAction={deleteFormAction} disabled={isDeletePending}>
                        <Trash2 width={20} className="cursor-pointer" />
                    </button>
                </form>

                <div>
                    <button onClick={() => setIsEditing(true)}>
                        <Pencil width={20} className="cursor-pointer" />
                    </button>
                </div>
            </div>
        </li>
    )
}