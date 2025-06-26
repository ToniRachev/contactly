import { InputHTMLAttributes } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import ErrorMessage from "./error-message";

type FormInputProps = {
    label: string,
    error?: string,
} & InputHTMLAttributes<HTMLInputElement>

export default function FormInput({ label, error, ...props }: FormInputProps) {
    return (
        <div className="grid gap-3 items-center">
            <Label htmlFor={props.name}>{label}</Label>
            <Input {...props} />
            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}
        </div>
    )
}