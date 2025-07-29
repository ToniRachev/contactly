import { getFriendRequests, getFriends, getFriendsSendRequests } from "@/lib/actions/friendship/friendship.actions";
import { fetchUserProfile } from "@/lib/actions/user/user.actions";
import UserProvider from "@/lib/context/user.context";
import { ReactNode } from "react";
import { SidebarProvider } from "../ui/sidebar";
import FriendsContextProvider from "@/lib/context/friends.context";
import PresenceProvider from "@/lib/context/presence.context";
import MessageProvider from "@/lib/context/conversation.context";
import { getConversations } from "@/lib/actions/conversation/conversation.actions";
import ConversationsProvider from "@/lib/context/conversations.context";

type AuthenticatedWrapperProps = {
    children: ReactNode;
    userId: string;
}

export default async function AuthenticatedWrapper({ children, userId }: Readonly<AuthenticatedWrapperProps>) {
    const userData = await fetchUserProfile(userId);

    const [friedsSendRequests, friendRequests, friends, conversations] = await Promise.all([
        getFriendsSendRequests(userData.id),
        getFriendRequests(userData.id),
        getFriends(userData.id),
        getConversations(userData.id)
    ])

    return (
        <UserProvider userData={userData}>
            <PresenceProvider>
                <FriendsContextProvider
                    friendSendRequests={friedsSendRequests}
                    initialFriendRequests={friendRequests}
                    initialFriends={friends}
                >
                    <ConversationsProvider initialConversations={conversations}>
                        <MessageProvider>
                            <SidebarProvider>
                                <main className="w-full">
                                    {children}
                                </main>
                            </SidebarProvider>
                        </MessageProvider>
                    </ConversationsProvider>
                </FriendsContextProvider>
            </PresenceProvider>
        </UserProvider>
    )
}