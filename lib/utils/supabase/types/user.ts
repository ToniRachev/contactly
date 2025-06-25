import { Session, User } from "@supabase/supabase-js"

export type BiographyType = {
    school: string | null,
    hometown: string | null,
    birth_date: string | null,
    current_city: string | null,
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
    id: string,
    created_at: string,
    first_name: string,
    last_name: string,
    biography: UserBiographyDBType[],
}

export type UserType = {
    id: string,
    created_at: string,
    email: string,
    phone: string,
    first_name: string,
    last_name: string,
    biography: BiographyType,
}