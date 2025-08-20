type SectionWrapperProps = {
    children: React.ReactNode;
    title: string;
}

export default function SectionWrapper({ children, title }: Readonly<SectionWrapperProps>) {
    return (
        <div className="space-y-4 bg-surface p-4 h-fit">
            <h6 className="text-lg font-bold">{title}</h6>
            {children}
        </div>
    )
}