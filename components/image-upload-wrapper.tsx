'use client';

import { InputHTMLAttributes, ReactNode, useRef } from "react";
import { Input } from "./ui/input";
import ErrorMessage from "./error-message";

type ImageUploadWrapperProps = {
    children: ReactNode;
    name: string;
    error?: string;
    multiple?: boolean;
    onImageChange: (image: FileList) => void;
} & InputHTMLAttributes<HTMLInputElement>

export default function ImageUploadWrapper({ children, name, onImageChange, error, multiple = false, ...props }: Readonly<ImageUploadWrapperProps>) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            onImageChange(files);
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
                    multiple={multiple}
                    accept="image/*"
                    {...props}
                />
            </button>
            {error && <ErrorMessage className="pt-2">{error}</ErrorMessage>}
        </div>
    )
}