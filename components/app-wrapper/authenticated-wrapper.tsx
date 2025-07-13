import { getFriendRequests, getFriends, getFriendsSendRequests } from "@/lib/actions/friendship/friendship.actions";
import { fetchUserProfile } from "@/lib/actions/user/user.actions";
import UserProvider from "@/lib/context/user.context";
import { ReactNode } from "react";
import { SidebarProvider } from "../ui/sidebar";
import FriendsContextProvider from "@/lib/context/friends.context";
import PresenceProvider from "@/lib/context/presence.context";

type AuthenticatedWrapperProps = {
    children: ReactNode;
    userId: string;
}

export default async function AuthenticatedWrapper({ children, userId }: Readonly<AuthenticatedWrapperProps>) {
    const userData = await fetchUserProfile(userId);

    const [friedsSendRequests, friendRequests, friends] = await Promise.all([
        getFriendsSendRequests(userData.id),
        getFriendRequests(userData.id),
        getFriends(userData.id)
    ])

    return (
        <UserProvider userData={userData}>
            <PresenceProvider>
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
            </PresenceProvider>
        </UserProvider>
    )
}