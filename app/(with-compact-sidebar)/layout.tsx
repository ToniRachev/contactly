import AppCompactSidebar from "@/components/app-compact-sidebar";
import ContentWrapper from "@/components/content-wrapper";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div>
            <div>
                <AppCompactSidebar />
            </div>
            <ContentWrapper>
                {children}
            </ContentWrapper>
        </div>
    )
}