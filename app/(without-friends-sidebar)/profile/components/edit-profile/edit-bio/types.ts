import { ReactNode } from "react";

export type BaseFieldConfig = {
    name: string;
    data: string | null;
    icon: ReactNode | null;
    type: 'text' | 'date';
    placeholder: string;
    dbField: string;
    label: string;
};

export type ActionState<T = Record<string, unknown>> = {
    data: T;
    success: boolean;
    errors: {
        fieldErrors?: Record<string, string[] | undefined>;
        formErrors?: string[];
    } | null;
};

export type FieldConfig = BaseFieldConfig & {
    initialState: ActionState;
};
