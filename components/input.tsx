import ErrorMessage from "./error-message";

type InputProps = {
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    error?: string;
}

export default function Input({ label, name, value, placeholder, error }: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name}>{label}</label>
            <input
                name={name}
                defaultValue={value}
                placeholder={placeholder}
                className="bg-white rounded-md px-3 py-2 text-stone-900 outline-0"
            />
            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}
        </div>
    )
}