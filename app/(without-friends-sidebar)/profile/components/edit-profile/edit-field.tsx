'use client';

import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, Pencil } from "lucide-react";
import { ReactNode, useState } from "react";

export type FieldType = {
    field: string;
    data: string | null;
    icon: ReactNode | null;
    type: 'text' | 'date';
}

type EditFieldProps = {
    field: FieldType;
}

type ControlsProps = {
    close: () => void;
}

const Controls = ({ close }: ControlsProps) => {
    return (
        <div className="w-full flex justify-end gap-4">
            <Button
                variant={'destructive'}
                onClick={close}
            >
                Cancel
            </Button>
            <Button variant={'secondary'}>Save</Button>
        </div>
    )
}

export default function EditField({ field }: EditFieldProps) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {

        if (field.type === 'date') {
            const date = typeof field.data === 'string' ? new Date(field.data) : undefined;

            return (
                <li className="py-4 flex items-center">
                    <DatePicker value={date} />
                    <Controls close={() => setIsEditing(false)} />
                </li>
            )
        }

        return (
            <li className="py-2">
                <Input
                    placeholder={(field.field.charAt(0).toUpperCase() + field.field.slice(1))}
                    defaultValue={field.data ?? ''}
                />

                <div className="w-full flex justify-end gap-4 pt-4">
                    <Controls close={() => setIsEditing(false)} />
                </div>
            </li>
        )
    }

    if (!field.data) {
        return (
            <li
                className="flex items-center gap-2 py-2 cursor-pointer w-fit"
                onClick={() => setIsEditing(true)}
            >
                <CirclePlus />
                <p>Add {field.field}</p>
            </li>
        )
    }

    return (
        <li className="flex justify-between py-2">
            <button
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => setIsEditing(true)}
            >
                {field.icon && field.icon}
                <p>{field.data}</p>
            </button>

            <div>
                <button onClick={() => setIsEditing(true)}>
                    <Pencil width={20} className="cursor-pointer" />
                </button>
            </div>
        </li>
    )
}