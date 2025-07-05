import { Session, User } from "@supabase/supabase-js"

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
}

export type StatusType = 'online' | 'offline';