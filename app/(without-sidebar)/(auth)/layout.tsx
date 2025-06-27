import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[url('/background_auth.webp')] bg-cover">
            {children}
        </div>
    )
}