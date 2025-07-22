import UserAvatarWithStatus from "@/components/user-avatar-with-status";
import { useFriends } from "@/lib/context/friends.context";
import { useMessageContext } from "@/lib/context/message.context";

export default function ActiveConversationUserCard() {
    const { activeConversationUserId } = useMessageContext();
    const { friends } = useFriends();

    const activeConversationUser = friends.find((friend) => friend.id === activeConversationUserId);

    if (!activeConversationUser) return null;

    return (
        <div className="flex items-center gap-4">
            <UserAvatarWithStatus
                avatar={activeConversationUser.avatarUrl}
                status={activeConversationUser.presenceStatus}
                size='md'
            />
            <div>
                <h6>{activeConversationUser.fullName}</h6>
                <p className="first-letter:uppercase">{activeConversationUser.presenceStatus}</p>
            </div>
        </div>
    )
}