import UserProvider from "@/lib/context/user.context";
import { fetchUserProfile } from "@/lib/actions/user/user.actions";
import { createClient } from "@/lib/utils/supabase/server";
import { ReactNode } from "react";
import { SidebarProvider } from "./ui/sidebar";
import FriendsContextProvider from "@/lib/context/friends.context";
import { getFriendRequests, getFriends, getFriendsSendRequests } from "@/lib/actions/friendship/friendship.actions";

const getUserWithProfile = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user ? fetchUserProfile(user.id) : null;
}

export default async function AppWrapper({ children }: Readonly<{ children: ReactNode }>) {
    const userData = await getUserWithProfile();

    const [friedsSendRequests, friendRequests, friends] = userData
        ? await Promise.all([
            getFriendsSendRequests(userData.id),
            getFriendRequests(userData.id),
            getFriends(userData.id)
        ]) : [[], [], []];

    return (
        <UserProvider userData={userData}>
            <FriendsContextProvider
                friendSendRequests={friedsSendRequests}
                initialFriendRequests={friendRequests}
                initialFriends={friends}
            >
                <SidebarProvider>
                    <main className="w-full">
                        {children}
                    </main>
                </SidebarProvider>
            </FriendsContextProvider>
        </UserProvider>
    )
}