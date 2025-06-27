import { ReactNode } from "react";

export default function ContentWrapper({ children }: { children: ReactNode }) {
    return (
        <div>
            <div className="w-full pt-8 px-12">
                {children}
            </div>
        </div>
    )
}