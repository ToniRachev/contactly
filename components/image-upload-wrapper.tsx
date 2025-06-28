'use client';

import { useRef } from "react";
import { Input } from "./ui/input";

export default function ImageUploadWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    return (
        <div className="relative w-full">
            <button onClick={handleClick} className="w-fit hover:opacity-80 hover:cursor-pointer h-full">
                {children}
                <Input
                    ref={inputRef}
                    hidden
                    name='profilePicture'
                    type='file'
                />
            </button>
        </div>
    )
}