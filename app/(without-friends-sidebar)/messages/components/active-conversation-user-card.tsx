import UserAvatarWithStatus from "@/components/user-avatar-with-status";
import { BaseUserType, UserWithPresenceStatusType } from "@/lib/types/user";

type ActiveConversationUserCardProps = {
    conversationParticipant: BaseUserType | UserWithPresenceStatusType | null;
}

const checkIfUserWithPresenceStatus = (user: BaseUserType | UserWithPresenceStatusType): user is UserWithPresenceStatusType => {
    return 'presenceStatus' in user && user.presenceStatus !== undefined;
};

export default function ActiveConversationUserCard({ conversationParticipant }: Readonly<ActiveConversationUserCardProps>) {
    if (!conversationParticipant) return null;

    const isUserWithPresenceStatus = checkIfUserWithPresenceStatus(conversationParticipant);

    return (
        <div className="flex items-center gap-4">
            <UserAvatarWithStatus
                avatar={conversationParticipant?.avatarUrl ?? null}
                status={isUserWithPresenceStatus ? conversationParticipant.presenceStatus : null}
                size='md'
            />
            <div>
                <h6>{conversationParticipant?.fullName}</h6>
                {isUserWithPresenceStatus && <p className="first-letter:uppercase">{conversationParticipant.presenceStatus}</p>}
            </div>
        </div>
    )
}