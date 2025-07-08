'use client';

import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { FieldConfig } from "./types";
import { updateUserBioAction } from "@/lib/actions/user/user.actions";
import FieldInput from "./field-input";
import EmptyFieldPlaceholder from "./empty-field-placeholder";
import FieldDisplayRow from "./field-display-row";
import { useUser } from "@/lib/context/user.context";

type ControlsProps = {
    close: () => void;
    isPending?: boolean;
}

const Controls = ({ close, isPending }: ControlsProps) => {
    return (
        <div className="w-full flex justify-end gap-4 items-center">
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
}

const FormField = ({ field, closeEditing }: FormFieldProps) => {
    const { updateUserBioField } = useUser();

    const actionWrapper = updateUserBioAction.bind(null, field.name, field.dbField);
    const [state, formAction, isPending] = useActionState(actionWrapper, field.initialState);
    const error = state.errors?.fieldErrors?.[field.name]?.[0] ?? state.errors?.formErrors?.[0];

    useEffect(() => {
        if (state.success) {
            updateUserBioField(field.name, state.data[field.name] as string);
            closeEditing();
        }
    }, [state, field, closeEditing, updateUserBioField])

    return (
        <form action={formAction}>
            <li className="py-4 grid grid-cols-2 items-end">
                <FieldInput
                    field={field}
                    state={state}
                    error={error}
                />

                <Controls
                    close={closeEditing}
                    isPending={isPending}
                />
            </li>
        </form >
    )
}

type EditFieldProps = {
    config: FieldConfig;
}

export default function EditField({ config }: Readonly<EditFieldProps>) {
    const [isEditing, setIsEditing] = useState(false);

    const handleCloseEditing = () => setIsEditing(false);
    const handleOpenEditing = () => setIsEditing(true);

    if (isEditing) {
        return (
            <li className="py-2">
                <FormField
                    field={config}
                    closeEditing={handleCloseEditing}
                />
            </li>
        )
    }

    if (!config.data) {
        return <EmptyFieldPlaceholder
            openEditing={handleOpenEditing}
            placeholder={config.placeholder}
        />
    }

    return (
        <FieldDisplayRow
            config={config}
            handleOpenEditing={handleOpenEditing}
            handleCloseEditing={handleCloseEditing}
        />
    )
}