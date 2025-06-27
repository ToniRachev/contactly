import AppSidebar from "@/components/app-sidebar";
import ContentWrapper from "@/components/content-wrapper";
import FriendsSidebar from "@/components/friends-sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex">
            <div className="">
                <AppSidebar />
            </div>
            <div className="flex-1 w-full">
                <ContentWrapper>
                    {children}
                </ContentWrapper>
            </div>
        </div>
    )
}