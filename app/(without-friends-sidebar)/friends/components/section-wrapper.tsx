import { ReactNode } from "react"

export default function SectionWrapper({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <ul className="grid grid-cols-5 gap-4">
            {children}
        </ul>
    )
}
