import { ReactNode } from "react";

export default function ErrorMessage({ children }: { children: ReactNode }) {
    return (
        <p className="text-red-300">{children}</p>
    )
}