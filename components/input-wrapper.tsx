import { InputHTMLAttributes } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import ErrorMessage from "./error-message";
import clsx from "clsx";

type FormInputProps = {
    label: string,
    error?: string,
    className?: string,
} & InputHTMLAttributes<HTMLInputElement>

export default function FormInput({ label, error, className, ...props }: FormInputProps) {
    return (
        <div className="grid gap-3 items-center">
            <Label htmlFor={props.name}>{label}</Label>
            <Input {...props} className={clsx("placeholder:text-stone-300", className)} />
            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}
        </div>
    )
}