'use client';

import { InputHTMLAttributes, ReactNode, useRef } from "react";
import { Input } from "./ui/input";
import ErrorMessage from "./error-message";

type ImageUploadWrapperProps = {
    children: ReactNode;
    name: string;
    error?: string;
    onImageChange: (image: File) => void;
} & InputHTMLAttributes<HTMLInputElement>

export default function ImageUploadWrapper({ children, name, onImageChange, error, ...props }: Readonly<ImageUploadWrapperProps>) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageChange(file);
        }
    }

    return (
        <div className="relative w-full flex flex-col justify-center items-center">
            <button onClick={handleClick} type="button" className="w-full hover:opacity-80 hover:cursor-pointer h-full">
                {children}
                <Input
                    ref={inputRef}
                    hidden
                    name={name}
                    type='file'
                    onChange={handleChange}
                    {...props}
                />
            </button>
            {error && <ErrorMessage className="pt-2">{error}</ErrorMessage>}
        </div>
    )
}