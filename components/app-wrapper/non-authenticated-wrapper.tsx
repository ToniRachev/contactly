export default function NonAuthenticatedWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="w-full">
            {children}
        </main>
    )
}