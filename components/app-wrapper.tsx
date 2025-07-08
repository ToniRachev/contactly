import UserProvider from "@/lib/context/user.context";
import { fetchUserProfile } from "@/lib/actions/user/user.actions";
import { createClient } from "@/lib/utils/supabase/server";
import { ReactNode } from "react";
import { SidebarProvider } from "./ui/sidebar";
import FriendsContextProvider from "@/lib/context/friends.context";

const getUserWithProfile = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user ? fetchUserProfile(user.id) : null;
}

export default async function AppWrapper({ children }: Readonly<{ children: ReactNode }>) {
    const userData = await getUserWithProfile();

    return (
        <UserProvider userData={userData}>
            <FriendsContextProvider>
                <SidebarProvider>
                    <main className="w-full">
                        {children}
                    </main>
                </SidebarProvider>
            </FriendsContextProvider>
        </UserProvider>
    )
}