import { DatePicker } from "@/components/date-picker";
import ErrorMessage from "@/components/error-message";
import InputWrapper from "@/components/input-wrapper";
import { ActionState, FieldConfig } from "./types";

type FieldInputProps = {
    field: FieldConfig;
    state: ActionState;
    error?: string;
}

export default function FieldInput({ field, state, error }: Readonly<FieldInputProps>) {
    if (field.type === 'date') {
        return (
            <div>
                <DatePicker
                    name={field.name}
                    value={state.data[field.name] as Date | undefined}
                />
                <ErrorMessage className="pt-2">{error}</ErrorMessage>
            </div>
        )
    }

    return (
        <InputWrapper
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={state.data[field.name] as string}
            label={field.label}
            error={error}
            className="selection:bg-blue-500 selection:text-white"
        />
    )
}
