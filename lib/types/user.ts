import { Session, User } from "@supabase/supabase-js"
import { BaseUserDBType } from "./post";

export type PresenceStatusType = 'online' | 'offline' | 'idle';

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

export type UserDBType = {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    biography: UserBiographyDBType[],
    avatar_url: string | null;
    cover_url: string | null;
    presence_status: PresenceStatusType;
    last_seen: Date;
}

export type UserType = {
    id: string;
    createdAt: string;
    email: string;
    firstName: string;
    lastName: string;
    biography: BiographyType;
    fullName: string;
    avatarUrl: string | null;
    coverUrl: string | null;
    presenceStatus: PresenceStatusType;
    lastSeen: Date;
}

export type FriendRequestUserDBType = {
    user: BaseUserDBType;
}