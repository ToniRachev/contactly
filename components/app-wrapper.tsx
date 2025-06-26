import UserProvider from "@/lib/context/user";
import { fetchUserProfile } from "@/lib/utils/supabase/actions/user/user";
import { createClient } from "@/lib/utils/supabase/server";
import { ReactNode } from "react";
import AppSidebar from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";

const getUserWithProfile = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user ? fetchUserProfile(user.id) : null;
}

export default async function AppWrapper({ children }: { children: ReactNode }) {
    const userData = getUserWithProfile();

    return (
        <UserProvider userData={userData}>
            <SidebarProvider>
                <main className="w-full flex">
                    <div className="">
                        <AppSidebar />
                    </div>
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </UserProvider>
    )
}