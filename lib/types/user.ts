import { Session, User } from "@supabase/supabase-js"
import { USER_PRESENCE_STATUS } from "../constants/user";

export type PresenceStatusType = typeof USER_PRESENCE_STATUS[keyof typeof USER_PRESENCE_STATUS];

export type BaseUserDBType = {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    createdAt: string;
    email: string;
}

export type BaseUserType = {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    createdAt: string;
    email: string;
    fullName: string;
}

export type BiographyType = {
    school: string | null,
    hometown: string | null,
    birthDate: string | null,
    currentCity: string | null,
}


export type AuthDataType = {
    user: User,
    session: Session,
}

export type UserBiographyDBType = {
    id: string;
    created_at: string,
    school: string | null,
    hometown: string | null,
    birth_date: string | null,
    current_city: string | null,
}

export type UserWithPresenceStatusDBType = BaseUserDBType & {
    presence_status: PresenceStatusType;
    last_seen: Date;
}

export type UserWithPresenceStatusType = BaseUserType & {
    presenceStatus: PresenceStatusType;
    lastSeen: Date;
}

export type UserProfileDBType = UserWithPresenceStatusDBType & {
    biography: UserBiographyDBType[];
    cover_url: string | null;
}

export type UserProfileType = UserWithPresenceStatusType & {
    biography: BiographyType;
    coverUrl: string | null;
}
