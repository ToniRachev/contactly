import { ReactNode } from "react";

export default function FormWrapper({ children }: { children: ReactNode }) {
    return (
        <div className="w-full h-full flex justify-center items-center min-h-screen">
            <div className="bg-white/10 p-24 rounded-3xl backdrop-blur-2xl text-white">
                <div className="pb-8">
                    <h1>Connectly</h1>
                    <h2>Login</h2>
                </div>
                {children}
            </div>
        </div>
    )
}